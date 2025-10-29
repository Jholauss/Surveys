// src/app/admin/surveys/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Copy, Eye, Trash2, ExternalLink } from 'lucide-react';

interface Survey {
  id: string;
  title: string;
  description?: string;
  type: string;
  uniqueLink: string;
  status: string;
  createdAt: string;
  questions: any[];
  surveyTeachers: any[];
  _count: { responses: number };
}

export default function SurveysPage() {
  const router = useRouter();

  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      const res = await fetch('/api/admin/surveys');
      const data = await res.json();
      if (res.ok) {
        setSurveys(data.surveys || []);
      }
    } catch (error) {
      console.error('Error cargando encuestas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (uniqueLink: string) => {
    const fullLink = `${window.location.origin}/survey/${uniqueLink}`;
    navigator.clipboard.writeText(fullLink);
    setCopiedLink(uniqueLink);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'draft':
        return 'Borrador';
      case 'closed':
        return 'Cerrada';
      default:
        return status;
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando encuestas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Encuestas</h1>
          <p className="text-gray-600">Crea y gestiona encuestas dinámicas</p>
        </div>
        <Button onClick={() => router.push('/admin/surveys/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Encuesta
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Encuestas Creadas</CardTitle>
          </CardHeader>
          <CardContent>
            {surveys.length === 0 ? (
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
                <p className="mt-2 text-gray-500">No hay encuestas creadas</p>
                <p className="text-sm text-gray-400">Crea tu primera encuesta para comenzar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {surveys.map((survey) => (
                  <div
                    key={survey.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{survey.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(survey.status)}`}>
                            {getStatusLabel(survey.status)}
                          </span>
                        </div>
                        {survey.description && (
                          <p className="text-sm text-gray-600 mt-1">{survey.description}</p>
                        )}
                        <div className="flex gap-3 mt-3 text-xs text-gray-500">
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            {survey.type}
                          </span>
                          <span>{survey.questions?.length || 0} preguntas</span>
                          <span>{survey._count?.responses || 0} respuestas</span>
                          <span>
                            {new Date(survey.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            /survey/{survey.uniqueLink}
                          </code>
                          <button
                            onClick={() => handleCopyLink(survey.uniqueLink)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Copiar link"
                          >
                            {copiedLink === survey.uniqueLink ? (
                              <span className="text-xs text-green-600">✓ Copiado</span>
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <a
                            href={`/survey/${survey.uniqueLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                            title="Abrir encuesta"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          onClick={() => router.push(`/admin/surveys/${survey.id}`)}
                        >
                          Ver detalles
                        </button>
                        <button
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                          onClick={() => router.push(`/admin/surveys/metrics?id=${survey.id}`)}
                        >
                          Métricas
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="text-2xl font-bold text-gray-900">{surveys.length}</div>
                <div className="text-sm text-gray-600">Encuestas Totales</div>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <div className="text-2xl font-bold text-gray-900">
                  {surveys.filter((s) => s.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Encuestas Activas</div>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <div className="text-2xl font-bold text-gray-900">
                  {surveys.reduce((acc, s) => acc + (s._count?.responses || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Respuestas Totales</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
