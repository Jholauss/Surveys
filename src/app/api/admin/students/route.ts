// src/app/api/admin/students/route.ts

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin/auth';

export async function GET() {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const students = await prisma.student.findMany({
      orderBy: { name: 'asc' }
    });
    return Response.json({ students });
  } catch (error) {
    console.error('Error fetching students:', error);
    return Response.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    // Validar que el código tenga 8 caracteres
    if (!data.code || data.code.length !== 8) {
      return Response.json(
        { error: 'El código debe tener exactamente 8 caracteres' },
        { status: 400 }
      );
    }

    const student = await prisma.student.create({
      data: {
        code: data.code.toUpperCase(),
        name: data.name,
        email: data.email,
        diplomatura: data.diplomatura,
        status: data.status || 'active'
      }
    });
    return Response.json(student);
  } catch (error: any) {
    console.error('Error creating student:', error);

    // Manejar error de código duplicado
    if (error.code === 'P2002') {
      return Response.json(
        { error: 'Ya existe un estudiante con ese código' },
        { status: 400 }
      );
    }

    return Response.json({ error: 'Failed to create student' }, { status: 500 });
  }
}
