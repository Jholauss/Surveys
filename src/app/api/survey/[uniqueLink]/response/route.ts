// src/app/api/survey/[uniqueLink]/response/route.ts

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uniqueLink: string }> }
) {
  try {
    const { uniqueLink } = await params;
    const { sessionToken, teacherId, answers } = await request.json();

    if (!sessionToken) {
      return Response.json({ error: 'Token de sesión requerido' }, { status: 400 });
    }

    // Buscar sesión
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: {
        survey: {
          include: {
            questions: true
          }
        },
        student: true
      }
    });

    if (!session) {
      return Response.json({ error: 'Sesión no encontrada' }, { status: 404 });
    }

    // Verificar que la sesión pertenezca a la encuesta correcta
    if (session.survey.uniqueLink !== uniqueLink) {
      return Response.json({ error: 'Sesión inválida para esta encuesta' }, { status: 400 });
    }

    // Verificar expiración
    if (new Date() > session.expiresAt) {
      return Response.json({ error: 'Sesión expirada' }, { status: 403 });
    }

    // Verificar que no esté completada
    if (session.completed) {
      return Response.json({ error: 'Sesión ya completada' }, { status: 400 });
    }

    // Validar respuestas obligatorias
    const requiredQuestions = session.survey.questions.filter(q => q.required);
    const missingAnswers = requiredQuestions.filter(
      q => !answers[q.id] && answers[q.id] !== 0
    );

    if (missingAnswers.length > 0) {
      return Response.json(
        { error: 'Faltan respuestas obligatorias' },
        { status: 400 }
      );
    }

    // Crear respuesta
    const response = await prisma.response.create({
      data: {
        surveyId: session.surveyId,
        sessionId: session.id,
        studentId: session.studentId,
        teacherId: teacherId || null,
        completed: true,
        metadata: {
          userAgent: request.headers.get('user-agent') || undefined,
          timestamp: new Date().toISOString()
        },
        answers: {
          create: Object.entries(answers).map(([questionId, value]) => ({
            questionId,
            value
          }))
        }
      },
      include: {
        answers: true
      }
    });

    // Actualizar contador de evaluaciones en la sesión
    await prisma.session.update({
      where: { id: session.id },
      data: {
        evaluatedCount: { increment: 1 }
      }
    });

    // Verificar si completó todas las evaluaciones
    const totalTeachers = await prisma.surveyTeacher.count({
      where: { surveyId: session.surveyId }
    });

    const completedEvaluations = await prisma.response.count({
      where: {
        sessionId: session.id,
        completed: true
      }
    });

    const allCompleted = completedEvaluations >= totalTeachers;

    // Si completó todas, marcar sesión como completada
    if (allCompleted) {
      await prisma.session.update({
        where: { id: session.id },
        data: { completed: true }
      });
    }

    return Response.json({
      response: {
        id: response.id,
        completed: true
      },
      session: {
        evaluatedCount: completedEvaluations,
        totalTeachers,
        allCompleted
      }
    });
  } catch (error) {
    console.error('Error creating response:', error);
    return Response.json(
      { error: 'Error al guardar la respuesta' },
      { status: 500 }
    );
  }
}
