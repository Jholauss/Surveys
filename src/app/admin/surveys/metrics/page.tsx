// src/app/admin/surveys/metrics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, CheckCircle, Clock } from 'lucide-react';

export default function MetricsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const surveyId = searchParams.get('id');

  const [survey, setSurvey] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (surveyId) {
      loadSurveyData();
      loadResponses();
    }
  }, [surveyId]);

  const loadSurveyData = async () => {
    try {
      const res = await fetch(`/api/admin/surveys?surveyId=${surveyId}`);
      const data = await res.json();
      if (res.ok) {
        setSurvey(data.survey);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const loadResponses = async () => {
    try {
      const res = await fetch(`/api/admin/surveys/${surveyId}/responses`);
      const data = await res.json();
      if (res.ok) {
        setResponses(data.responses || []);
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando métricas...</div>;
  }

  if (!survey) {
    return <div className="text-center py-12">Encuesta no encontrada</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/surveys')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{survey.title}</h1>
          <p className="text-gray-600">Métricas y Respuestas</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Respuestas
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResponses || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasa de Finalización
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completionRate || 100}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tiempo Promedio
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageTime || '--'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Respuestas */}
      <Card>
        <CardHeader>
          <CardTitle>Respuestas Recibidas</CardTitle>
        </CardHeader>
        <CardContent>
          {responses.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay respuestas todavía
            </p>
          ) : (
            <div className="space-y-6">
              {responses.map((response) => (
                <div
                  key={response.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium">
                        {response.student?.name || 'Anónimo'}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(response.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {response.answers.map((answer: any) => (
                      <div
                        key={answer.id}
                        className="bg-gray-50 p-3 rounded"
                      >
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          {answer.question.question}
                        </p>
                        <p className="text-sm text-gray-900">
                          {typeof answer.value === 'object'
                            ? JSON.stringify(answer.value)
                            : answer.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
