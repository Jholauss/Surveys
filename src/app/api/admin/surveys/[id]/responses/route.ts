// src/app/api/admin/surveys/[id]/responses/route.ts

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;

    const responses = await prisma.response.findMany({
      where: {
        surveyId: id,
        completed: true
      },
      include: {
        student: true,
        answers: {
          include: {
            question: true
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      }
    });

    // Calcular estadísticas
    const stats = {
      totalResponses: responses.length,
      completionRate: 0, // Podría calcularse comparando con sesiones
      averageTime: 0 // Requeriría timestamps adicionales
    };

    return Response.json({ responses, stats });
  } catch (error) {
    console.error('Error fetching responses:', error);
    return Response.json(
      { error: 'Failed to fetch responses' },
      { status: 500 }
    );
  }
}
