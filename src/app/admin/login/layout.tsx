// src/app/admin/login/layout.tsx

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra azul superior con logo */}
      <div className="w-full bg-[#042254] py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-4">
          {/* Logo (solo si existe) */}
          <div className="h-16 w-16 bg-white/10 rounded-lg flex items-center justify-center">
            <span className="text-white text-2xl font-bold">P</span>
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold">Panel de Administración</h1>
            <p className="text-gray-200">Sistema de evaluación docente - PUCP</p>
          </div>
        </div>
      </div>

      {/* Contenido centrado */}
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-6">
        {children}
      </div>
    </div>
  );
}