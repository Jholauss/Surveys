// middleware.ts (en la raíz, al mismo nivel que package.json)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('admin_session');

  // Si está en /admin (raíz), redirigir según tenga sesión o no
  if (pathname === '/admin') {
    if (session?.value) {
      return NextResponse.redirect(new URL('/admin/surveys', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Proteger todas las rutas de /admin/*
  if (pathname.startsWith('/admin/')) {
    if (!session?.value) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*'
  ],
};