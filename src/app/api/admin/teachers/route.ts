// src/app/api/admin/teachers/route.ts

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin/auth';

export async function GET() {
  try {
    console.log('[Teachers API] Verificando autenticación...');
    const isAuthenticated = await isAdminAuthenticated();

    if (!isAuthenticated) {
      console.log('[Teachers API] No autenticado');
      return Response.json({ error: 'Unauthorized', message: 'No está autenticado como admin' }, { status: 401 });
    }

    console.log('[Teachers API] Autenticado, obteniendo docentes...');
    const teachers = await prisma.teacher.findMany({
      orderBy: { name: 'asc' }
    });

    console.log(`[Teachers API] Encontrados ${teachers.length} docentes`);
    return Response.json({ teachers });
  } catch (error: any) {
    console.error('[Teachers API] Error:', error);
    return Response.json({
      error: 'Failed to fetch teachers',
      message: error.message,
      details: error.toString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[Teachers API POST] Verificando autenticación...');
    const isAuthenticated = await isAdminAuthenticated();

    if (!isAuthenticated) {
      console.log('[Teachers API POST] No autenticado');
      return Response.json({ error: 'Unauthorized', message: 'No está autenticado como admin' }, { status: 401 });
    }

    const data = await request.json();
    console.log('[Teachers API POST] Creando docente:', data.name);

    const teacher = await prisma.teacher.create({
      data: {
        name: data.name,
        email: data.email || null,
        subject: data.subject || null,
        diplomatura: data.diplomatura || null,
        photo: data.photo || null,
        status: data.status || 'active'
      }
    });

    console.log('[Teachers API POST] Docente creado:', teacher.id);
    return Response.json(teacher);
  } catch (error: any) {
    console.error('[Teachers API POST] Error:', error);
    return Response.json({
      error: 'Failed to create teacher',
      message: error.message,
      details: error.toString()
    }, { status: 500 });
  }
}