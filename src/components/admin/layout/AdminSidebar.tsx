// src/components/admin/layout/AdminSidebar.tsx

'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, Users, FileText, BarChart3, Settings, LogOut, User } from 'lucide-react';
import Link from 'next/link';

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      // Eliminar la cookie
      document.cookie = 'admin_session=; path=/; max-age=0';
      
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'same-origin'
      });
      
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Eliminar cookie aunque falle el API
      document.cookie = 'admin_session=; path=/; max-age=0';
      router.push('/admin/login');
    }
  };

  return (
    <aside 
      className={`bg-[#1a1a2e] text-white transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Header del menú */}
      <div className="p-4 border-b border-[#16213e] flex items-center justify-between">
        {isSidebarOpen && (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-[#0f3460] rounded-full flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <h1 className="text-lg font-bold">John Smith</h1>
            </div>
            <p className="text-xs text-gray-300">Administrador PUCP</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="ml-auto text-white hover:text-gray-300"
        >
          {isSidebarOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </Button>
      </div>

      {/* Navegación */}
      <nav className="p-4 space-y-2">
        
        <Link 
          href="/admin/surveys" 
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            pathname.startsWith('/admin/surveys') 
              ? 'bg-[#0f3460] text-white' 
              : 'hover:bg-[#0f3460] hover:text-white'
          }`}
        >
          <FileText className="w-5 h-5" />
          {isSidebarOpen && 'Encuestas'}
        </Link>

        <Link 
          href="/admin/teachers" 
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            pathname.startsWith('/admin/teachers') 
              ? 'bg-[#0f3460] text-white' 
              : 'hover:bg-[#0f3460] hover:text-white'
          }`}
        >
          <Users className="w-5 h-5" />
          {isSidebarOpen && 'Docentes'}
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-red-900 hover:text-white w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          {isSidebarOpen && 'Cerrar Sesión'}
        </button>
      </nav>
    </aside>
  );
}