// src/app/admin/surveys/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ Importa useRouter
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

export default function SurveysPage() {
  const router = useRouter(); // ✅ Inicializa useRouter
  
  const [templates, setTemplates] = useState([
    {
      id: 1,
      title: 'Evaluación ',
      description: 'Evaluación ',
      category: 'satisfaccion',
      createdAt: '2025-10-10T10:00:00Z',
      questions: 5
    }
  ]);

  const handleDeleteTemplate = (id:number) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Encuestas</h1>
          <p className="text-gray-600">Crea y gestiona plantillas de encuestas</p>
        </div>
        {/* ✅ Cambia el botón para redirigir directamente */}
        <Button onClick={() => router.push('/admin/surveys/create')}>
          Nueva Encuesta
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Plantillas de Encuestas</CardTitle>
          </CardHeader>
          <CardContent>
            {templates.length === 0 ? (
              <div className="text-center py-12">
                <svg 
                  className="mx-auto h-12 w-12 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                <p className="mt-2 text-gray-500">No hay plantillas de encuestas creadas</p>
                <p className="text-sm text-gray-400">Crea tu primera plantilla para comenzar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {templates.map((template) => (
                  <div 
                    key={template.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{template.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        <div className="flex gap-3 mt-3 text-xs text-gray-500">
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            {template.category}
                          </span>
                          <span>{template.questions} preguntas</span>
                          <span>Creada el {new Date(template.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          onClick={() => alert('Editar plantilla: ' + template.id)}
                        >
                          Editar
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          Eliminar
                        </button>
                        <button 
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          onClick={() => router.push('/admin/surveys/metrics')}
                        >
                          Ver respuestas
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ✅ Elimina el formulario inline - ahora se maneja en /admin/surveys/create */}
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="text-2xl font-bold text-gray-900">{templates.length}</div>
                <div className="text-sm text-gray-600">Plantillas Creadas</div>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Encuestas Activas</div>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Respuestas Totales</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}