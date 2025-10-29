// src/app/api/admin/teachers/upload-photo/route.ts

import { NextRequest } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { isAdminAuthenticated } from '@/lib/admin/auth';

export async function POST(request: NextRequest) {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('photo') as File;

    if (!file) {
      return Response.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return Response.json({
        error: 'Invalid file type. Only JPEG, PNG and WebP are allowed'
      }, { status: 400 });
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return Response.json({
        error: 'File too large. Maximum size is 5MB'
      }, { status: 400 });
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const fileName = `teacher_${timestamp}.${extension}`;

    // Convertir el archivo a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Guardar el archivo
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'teachers');
    const filePath = join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    // Retornar la URL pública
    const photoUrl = `/uploads/teachers/${fileName}`;

    return Response.json({
      success: true,
      photoUrl,
      fileName
    });

  } catch (error) {
    console.error('Error uploading photo:', error);
    return Response.json({
      error: 'Failed to upload photo'
    }, { status: 500 });
  }
}
