// src/lib/admin/auth.ts

import { cookies } from 'next/headers';

const ADMIN_EMAILS = ['admin@pucp.edu.pe', 'evaluaciones@pucp.edu.pe'];
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function authenticateAdmin(email: string, password: string): Promise<boolean> {
  if (ADMIN_EMAILS.includes(email) && password === ADMIN_PASSWORD) {
    cookies().set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/admin'
    });
    return true;
  }
  return false;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = cookies().get('admin_session');
  return session?.value === 'authenticated';
}

export async function logoutAdmin() {
  cookies().delete('admin_session');
}