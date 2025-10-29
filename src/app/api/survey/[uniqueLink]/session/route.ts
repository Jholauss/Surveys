// src/app/api/survey/[uniqueLink]/session/route.ts

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uniqueLink: string }> }
) {
  try {
    const { uniqueLink } = await params;
    const { studentCode } = await request.json();

    // Validar formato del código (8 caracteres)
    if (!studentCode || studentCode.length !== 8) {
      return Response.json(
        { error: 'El código debe tener exactamente 8 caracteres' },
        { status: 400 }
      );
    }

    // Buscar encuesta
    const survey = await prisma.survey.findUnique({
      where: { uniqueLink },
      include: {
        surveyTeachers: {
          include: { teacher: true }
        }
      }
    });

    if (!survey) {
      return Response.json({ error: 'Encuesta no encontrada' }, { status: 404 });
    }

    // Verificar que la encuesta esté activa
    if (survey.status !== 'active') {
      return Response.json(
        { error: 'Esta encuesta no está disponible' },
        { status: 403 }
      );
    }

    // Si requiere código, validar estudiante
    let student = null;
    if (survey.requiresCode) {
      student = await prisma.student.findUnique({
        where: { code: studentCode.toUpperCase() }
      });

      if (!student) {
        return Response.json(
          { error: 'Código de estudiante no válido' },
          { status: 404 }
        );
      }

      if (student.status !== 'active') {
        return Response.json(
          { error: 'Estudiante no está activo' },
          { status: 403 }
        );
      }
    }

    // Crear sesión
    const sessionToken = nanoid(32);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Expira en 24 horas

    const session = await prisma.session.create({
      data: {
        surveyId: survey.id,
        studentId: student?.id,
        sessionToken,
        expiresAt
      }
    });

    const teachers = survey.surveyTeachers.map(st => st.teacher);

    console.log('[Session API POST] Sesión creada exitosamente');
    console.log('[Session API POST] Docentes en la encuesta:', teachers.length);
    console.log('[Session API POST] Docentes:', teachers.map(t => t.name));

    return Response.json({
      session: {
        id: session.id,
        token: sessionToken,
        survey: {
          id: survey.id,
          title: survey.title,
          description: survey.description,
          type: survey.type
        },
        student: student ? {
          name: student.name,
          code: student.code,
          diplomatura: student.diplomatura
        } : null,
        teachers: teachers,
        totalTeachers: teachers.length,
        evaluatedCount: 0,
        evaluatedTeacherIds: []
      }
    });
  } catch (error: any) {
    console.error('[Session API POST] Error creating session:', error);
    return Response.json(
      { error: 'Error al crear la sesión', message: error.message },
      { status: 500 }
    );
  }
}

// Obtener sesión existente
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uniqueLink: string }> }
) {
    await params; // Necesario aunque no lo usemos directamente
  try {
    const { searchParams } = new URL(request.url);
    const sessionToken = searchParams.get('token');

    if (!sessionToken) {
      return Response.json({ error: 'Token requerido' }, { status: 400 });
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: {
        survey: {
          include: {
            surveyTeachers: {
              include: { teacher: true }
            }
          }
        },
        student: true,
        responses: {
          select: {
            teacherId: true
          }
        }
      }
    });

    if (!session) {
      return Response.json({ error: 'Sesión no encontrada' }, { status: 404 });
    }

    // Verificar expiración
    if (new Date() > session.expiresAt) {
      return Response.json({ error: 'Sesión expirada' }, { status: 403 });
    }

    // Obtener docentes evaluados
    const evaluatedTeacherIds = session.responses.map(r => r.teacherId).filter(Boolean);
    const teachers = session.survey.surveyTeachers.map(st => st.teacher);

    console.log('[Session API GET] Sesión recuperada');
    console.log('[Session API GET] Total docentes:', teachers.length);
    console.log('[Session API GET] Docentes evaluados:', evaluatedTeacherIds.length);

    return Response.json({
      session: {
        id: session.id,
        token: sessionToken,
        completed: session.completed,
        evaluatedTeacherIds,
        teachers: teachers,
        totalTeachers: teachers.length,
        evaluatedCount: evaluatedTeacherIds.length,
        survey: session.survey,
        student: session.student
      }
    });
  } catch (error: any) {
    console.error('[Session API GET] Error fetching session:', error);
    return Response.json(
      { error: 'Error al obtener la sesión', message: error.message },
      { status: 500 }
    );
  }
}
