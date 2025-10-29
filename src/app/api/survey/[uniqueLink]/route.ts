// src/app/api/survey/[uniqueLink]/route.ts

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uniqueLink: string }> }
) {
  try {
    const { uniqueLink } = await params;

    console.log('[Survey API] Buscando encuesta con uniqueLink:', uniqueLink);

    const survey = await prisma.survey.findUnique({
      where: { uniqueLink },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        },
        surveyTeachers: {
          include: {
            teacher: true
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!survey) {
      console.log('[Survey API] Encuesta no encontrada:', uniqueLink);
      return Response.json({ error: 'Encuesta no encontrada' }, { status: 404 });
    }

    console.log('[Survey API] Encuesta encontrada:', survey.id, 'Status:', survey.status);

    // Verificar estado de la encuesta
    if (survey.status !== 'active') {
      console.log('[Survey API] Encuesta no activa:', survey.status);
      return Response.json(
        { error: 'Esta encuesta no está disponible actualmente' },
        { status: 403 }
      );
    }

    // Verificar fechas
    const now = new Date();
    if (survey.startsAt && now < survey.startsAt) {
      console.log('[Survey API] Encuesta no ha comenzado aún');
      return Response.json(
        { error: 'Esta encuesta aún no ha comenzado' },
        { status: 403 }
      );
    }

    if (survey.endsAt && now > survey.endsAt) {
      console.log('[Survey API] Encuesta ya finalizó');
      return Response.json(
        { error: 'Esta encuesta ha finalizado' },
        { status: 403 }
      );
    }

    console.log('[Survey API] Encuesta válida, devolviendo datos');
    return Response.json({ survey });
  } catch (error: any) {
    console.error('[Survey API] Error:', error);
    return Response.json(
      { error: 'Error al cargar la encuesta', message: error.message },
      { status: 500 }
    );
  }
}
