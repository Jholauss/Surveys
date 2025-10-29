// middleware.ts (en la raíz, al mismo nivel que package.json)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('admin_session');
  
  console.log('🔍 MIDDLEWARE - Pathname:', pathname);
  console.log('🔍 MIDDLEWARE - Session:', session?.value);
  
  // Si está en /admin (raíz), redirigir según tenga sesión o no
  if (pathname === '/admin') {
    console.log('✅ Ruta /admin detectada');
    if (session?.value) {
      return NextResponse.redirect(new URL('/admin/surveys', request.url));
    } else {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  // Permitir acceso libre a /admin/login
  if (pathname === '/admin/login') {
    console.log('✅ Ruta /admin/login detectada');
    // Si ya tiene sesión, redirigir al dashboard
    if (session?.value) {
      console.log('🔄 Redirigiendo a dashboard (ya tiene sesión)');
      return NextResponse.redirect(new URL('/admin/surveys', request.url));
    }
    console.log('✅ Permitiendo acceso a login');
    return NextResponse.next();
  }
  
  // Proteger todas las demás rutas de /admin/*
  if (pathname.startsWith('/admin/')) {
    console.log('🔒 Ruta protegida detectada:', pathname);
    if (!session?.value) {
      console.log('🔄 Redirigiendo a login (sin sesión)');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  console.log('✅ Permitiendo acceso');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*'
  ],
};