// src/app/api/admin/surveys/bulk/route.ts

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin/auth';
import { nanoid } from 'nanoid';

interface QuestionData {
  type: string;
  question: string;
  description?: string;
  options?: any;
  required?: boolean;
  minValue?: number;
  maxValue?: number;
}

interface SurveyData {
  title: string;
  description?: string;
  type: string;
  status?: string;
  startsAt?: string;
  endsAt?: string;
  requiresCode?: boolean;
  allowAnonymous?: boolean;
  questions: QuestionData[];
  teacherIds?: string[];
  teacherNames?: string[]; // Opcional: buscar teachers por nombre
}

export async function POST(request: NextRequest) {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { surveys } = await request.json() as { surveys: SurveyData[] };

    if (!Array.isArray(surveys) || surveys.length === 0) {
      return Response.json({
        error: 'Invalid data. Expected array of surveys'
      }, { status: 400 });
    }

    const results = {
      created: [] as any[],
      errors: [] as any[]
    };

    for (const surveyData of surveys) {
      try {
        // Generar link único
        const uniqueLink = nanoid(10);

        // Si se enviaron nombres de teachers, buscarlos en la BD
        let teacherIds = surveyData.teacherIds || [];

        if (surveyData.teacherNames && surveyData.teacherNames.length > 0) {
          const teachers = await prisma.teacher.findMany({
            where: {
              name: {
                in: surveyData.teacherNames
              }
            },
            select: { id: true }
          });
          teacherIds = teachers.map(t => t.id);
        }

        // Crear encuesta con preguntas y docentes asociados
        const survey = await prisma.survey.create({
          data: {
            title: surveyData.title,
            description: surveyData.description,
            type: surveyData.type,
            uniqueLink,
            status: surveyData.status || 'draft',
            startsAt: surveyData.startsAt ? new Date(surveyData.startsAt) : null,
            endsAt: surveyData.endsAt ? new Date(surveyData.endsAt) : null,
            requiresCode: surveyData.requiresCode ?? true,
            allowAnonymous: surveyData.allowAnonymous ?? false,
            questions: {
              create: surveyData.questions.map((q, index) => ({
                type: q.type,
                question: q.question,
                description: q.description,
                options: q.options,
                required: q.required ?? true,
                order: index,
                minValue: q.minValue,
                maxValue: q.maxValue
              }))
            },
            surveyTeachers: teacherIds.length > 0 ? {
              create: teacherIds.map((teacherId, index) => ({
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

        results.created.push({
          id: survey.id,
          title: survey.title,
          uniqueLink: survey.uniqueLink,
          publicLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/survey/${uniqueLink}`,
          questionsCount: survey.questions.length,
          teachersCount: survey.surveyTeachers.length
        });

      } catch (error: any) {
        results.errors.push({
          survey: surveyData.title,
          error: error.message
        });
      }
    }

    return Response.json({
      success: true,
      summary: {
        total: surveys.length,
        created: results.created.length,
        errors: results.errors.length
      },
      results
    });

  } catch (error) {
    console.error('Error in bulk survey creation:', error);
    return Response.json({
      error: 'Failed to process bulk survey creation'
    }, { status: 500 });
  }
}
