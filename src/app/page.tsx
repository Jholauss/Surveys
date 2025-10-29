// src/app/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import { FileText, Shield, Users, ArrowRight, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Sistema de Encuestas</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Crea y Gestiona Encuestas Dinámicas
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Plataforma completa para crear formularios personalizados, recolectar respuestas
            y analizar resultados en tiempo real.
          </p>
        </div>

        {/* Cards de Acceso */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card Admin */}
          <Card className="p-8 hover:shadow-xl transition-shadow border-2 hover:border-blue-500">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <Shield className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Acceso Administrador
              </h3>
              <p className="text-gray-600">
                Crea encuestas personalizadas, gestiona docentes y estudiantes,
                y analiza los resultados.
              </p>
              <ul className="text-sm text-gray-600 space-y-2 text-left w-full">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                  Crear formularios dinámicos
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                  Generar links únicos de acceso
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                  Ver métricas y respuestas
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                  Gestionar usuarios
                </li>
              </ul>
              <Button
                onClick={() => router.push('/login')}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Iniciar Sesión
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>

          {/* Card Estudiantes/Usuarios */}
          <Card className="p-8 hover:shadow-xl transition-shadow border-2 hover:border-purple-500">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-purple-100 rounded-full">
                <Users className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Acceso a Encuestas
              </h3>
              <p className="text-gray-600">
                Completa encuestas y evaluaciones mediante el link único
                que recibiste.
              </p>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 w-full">
                <p className="text-sm text-purple-900 font-medium mb-2">
                  ¿Tienes un link de encuesta?
                </p>
                <p className="text-xs text-purple-700">
                  El administrador te habrá proporcionado un link único.
                  Accede directamente mediante ese link para completar la encuesta.
                </p>
              </div>
              <div className="text-xs text-gray-500 space-y-1 w-full text-left bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-700">Formato del link:</p>
                <code className="text-purple-600">
                  https://sistema.com/survey/abc123xyz0
                </code>
              </div>
            </div>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="text-center p-6">
            <div className="inline-flex p-3 bg-blue-100 rounded-lg mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Formularios Dinámicos</h4>
            <p className="text-sm text-gray-600">
              Crea preguntas de texto, ratings, opciones múltiples y más
            </p>
          </div>
          <div className="text-center p-6">
            <div className="inline-flex p-3 bg-purple-100 rounded-lg mb-4">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Seguro y Confiable</h4>
            <p className="text-sm text-gray-600">
              Sesiones seguras con tokens únicos y expiración automática
            </p>
          </div>
          <div className="text-center p-6">
            <div className="inline-flex p-3 bg-green-100 rounded-lg mb-4">
              <ClipboardList className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Análisis en Tiempo Real</h4>
            <p className="text-sm text-gray-600">
              Visualiza respuestas y métricas conforme se completan
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>Sistema de Encuestas Dinámicas © 2024</p>
        </div>
      </footer>
    </div>
  );
}
