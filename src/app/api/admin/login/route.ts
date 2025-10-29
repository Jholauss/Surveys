// src/app/api/admin/login/route.ts

import { NextRequest } from 'next/server';
import { authenticateAdmin } from '@/lib/admin/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: 'Email y contraseña requeridos' },
        { status: 400 }
      );
    }

    const isAuthenticated = await authenticateAdmin(email, password);

    if (isAuthenticated) {
      return Response.json({ success: true });
    } else {
      return Response.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
