// src/app/admin/layout.tsx

'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Si estamos en /admin/login, NO mostrar el sidebar
  const isLoginPage = pathname === '/admin/login';
  
  if (isLoginPage) {
    return <>{children}</>;
  }
  
  // Para todas las demás rutas de /admin/*, mostrar con sidebar
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Menú lateral */}
      <AdminSidebar />
      
      {/* Contenido principal */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}