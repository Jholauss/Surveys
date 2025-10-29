// src/app/api/admin/logout/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Eliminar la cookie de sesión
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_session');
  
  return response;
}