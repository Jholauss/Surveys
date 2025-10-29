// src/app/api/admin/teachers/bulk/route.ts

import { NextRequest } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin/auth';

interface TeacherData {
  name: string;
  email?: string;
  subject?: string;
  diplomatura?: string;
  photo?: string; // Puede ser base64 o URL
  photoBase64?: string; // Base64 de la imagen
  status?: string;
}

export async function POST(request: NextRequest) {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { teachers } = await request.json() as { teachers: TeacherData[] };

    if (!Array.isArray(teachers) || teachers.length === 0) {
      return Response.json({
        error: 'Invalid data. Expected array of teachers'
      }, { status: 400 });
    }

    const results = {
      created: [] as any[],
      errors: [] as any[]
    };

    for (const teacherData of teachers) {
      try {
        let photoUrl = teacherData.photo;

        // Si se envió foto en base64, guardarla
        if (teacherData.photoBase64) {
          try {
            // Detectar el tipo de imagen del base64
            const matches = teacherData.photoBase64.match(/^data:image\/(\w+);base64,(.+)$/);

            if (matches) {
              const extension = matches[1]; // jpg, png, etc.
              const base64Data = matches[2];

              // Generar nombre único
              const timestamp = Date.now();
              const fileName = `teacher_${timestamp}_${teacherData.name.replace(/\s+/g, '_')}.${extension}`;

              // Convertir base64 a buffer
              const buffer = Buffer.from(base64Data, 'base64');

              // Guardar el archivo
              const uploadDir = join(process.cwd(), 'public', 'uploads', 'teachers');
              const filePath = join(uploadDir, fileName);

              await writeFile(filePath, buffer);

              // Actualizar la URL de la foto
              photoUrl = `/uploads/teachers/${fileName}`;
            } else if (teacherData.photoBase64.startsWith('iVBOR') || teacherData.photoBase64.startsWith('/9j/')) {
              // Base64 sin prefijo, intentar detectar el formato
              const isPng = teacherData.photoBase64.startsWith('iVBOR');
              const extension = isPng ? 'png' : 'jpg';

              const timestamp = Date.now();
              const fileName = `teacher_${timestamp}_${teacherData.name.replace(/\s+/g, '_')}.${extension}`;

              const buffer = Buffer.from(teacherData.photoBase64, 'base64');

              const uploadDir = join(process.cwd(), 'public', 'uploads', 'teachers');
              const filePath = join(uploadDir, fileName);

              await writeFile(filePath, buffer);

              photoUrl = `/uploads/teachers/${fileName}`;
            }
          } catch (photoError) {
            console.error(`Error processing photo for ${teacherData.name}:`, photoError);
            // Continuar sin foto si hay error
          }
        }

        // Crear el docente en la BD
        const teacher = await prisma.teacher.create({
          data: {
            name: teacherData.name,
            email: teacherData.email || null,
            subject: teacherData.subject || null,
            diplomatura: teacherData.diplomatura || null,
            photo: photoUrl || null,
            status: teacherData.status || 'active'
          }
        });

        results.created.push({
          id: teacher.id,
          name: teacher.name,
          photo: teacher.photo
        });

      } catch (error: any) {
        results.errors.push({
          teacher: teacherData.name,
          error: error.message
        });
      }
    }

    return Response.json({
      success: true,
      summary: {
        total: teachers.length,
        created: results.created.length,
        errors: results.errors.length
      },
      results
    });

  } catch (error) {
    console.error('Error in bulk teacher creation:', error);
    return Response.json({
      error: 'Failed to process bulk teacher creation'
    }, { status: 500 });
  }
}
