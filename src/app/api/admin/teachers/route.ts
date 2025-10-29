// src/app/api/admin/teachers/route.ts

import { NextRequest } from 'next/server';
import { adminDatabase } from '@/lib/database/admin-db';
import { isAdminAuthenticated } from '@/lib/admin/auth';

export async function GET() {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const teachers = adminDatabase.getTeachers();
    return Response.json({ teachers });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch teachers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const data = await request.json();
    const teacher = adminDatabase.createTeacher({
      id: `TEACH-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return Response.json(teacher);
  } catch (error) {
    return Response.json({ error: 'Failed to create teacher' }, { status: 500 });
  }
}