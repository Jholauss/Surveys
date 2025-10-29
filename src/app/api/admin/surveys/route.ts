// src/app/api/admin/surveys/route.ts

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin/auth';
import { nanoid } from 'nanoid';

export async function GET(request: NextRequest) {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const surveyId = searchParams.get('surveyId');

  try {
    if (surveyId) {
      // Obtener una encuesta específica con sus preguntas y docentes
      const survey = await prisma.survey.findUnique({
        where: { id: surveyId },
        include: {
          questions: { orderBy: { order: 'asc' } },
          surveyTeachers: {
            include: { teacher: true },
            orderBy: { order: 'asc' }
          }
        }
      });

      if (!survey) {
        return Response.json({ error: 'Survey not found' }, { status: 404 });
      }

      return Response.json({ survey });
    } else {
      // Obtener todas las encuestas
      const surveys = await prisma.survey.findMany({
        include: {
          questions: true,
          surveyTeachers: {
            include: { teacher: true }
          },
          _count: {
            select: { responses: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return Response.json({ surveys });
    }
  } catch (error) {
    console.error('Error fetching surveys:', error);
    return Response.json({ error: 'Failed to fetch surveys' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    // Generar link único
    const uniqueLink = nanoid(10); // Genera un ID único de 10 caracteres

    // Crear encuesta con preguntas y docentes asociados
    const survey = await prisma.survey.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        uniqueLink,
        status: data.status || 'draft',
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        endsAt: data.endsAt ? new Date(data.endsAt) : null,
        requiresCode: data.requiresCode ?? true,
        allowAnonymous: data.allowAnonymous ?? false,
        questions: {
          create: data.questions?.map((q: any, index: number) => ({
            type: q.type,
            question: q.question,
            description: q.description,
            options: q.options,
            required: q.required ?? true,
            order: index,
            minValue: q.minValue,
            maxValue: q.maxValue
          })) || []
        },
        surveyTeachers: data.teacherIds ? {
          create: data.teacherIds.map((teacherId: string, index: number) => ({
            teacherId,
            order: index
          }))
        } : undefined
      },
      include: {
        questions: true,
        surveyTeachers: {
          include: { teacher: true }
        }
      }
    });

    return Response.json({
      survey,
      publicLink: `${process.env.NEXT_PUBLIC_APP_URL}/survey/${uniqueLink}`
    });
  } catch (error) {
    console.error('Error creating survey:', error);
    return Response.json({ error: 'Failed to create survey' }, { status: 500 });
  }
}