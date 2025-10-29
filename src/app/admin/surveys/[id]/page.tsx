"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Copy, CheckCircle } from "lucide-react";

interface Survey {
  id: string;
  title: string;
  description?: string;
  type: string;
  uniqueLink: string;
  status: string;
  requiresCode: boolean;
  allowAnonymous: boolean;
  startsAt?: string;
  endsAt?: string;
  createdAt: string;
  questions: Array<{
    id: string;
    type: string;
    question: string;
    description?: string;
    options?: any;
    required: boolean;
    order: number;
    minValue?: number;
    maxValue?: number;
  }>;
  surveyTeachers: Array<{
    id: string;
    order: number;
    teacher: {
      id: string;
      name: string;
      email?: string;
      subject?: string;
      diplomatura?: string;
      photo?: string;
    };
  }>;
  _count: {
    responses: number;
  };
}

export default function SurveyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.id as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadSurvey();
  }, [surveyId]);

  const loadSurvey = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/surveys?surveyId=${surveyId}`);
      const data = await res.json();

      if (res.ok) {
        setSurvey(data.survey);
      } else {
        setError(data.error || "Error al cargar encuesta");
      }
    } catch (err) {
      setError("Error de conexion");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/survey/${survey?.uniqueLink}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Cargando encuesta...</p>
      </div>
    );
  }

  if (error || !survey) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-lg text-red-600">{error || "Encuesta no encontrada"}</p>
        <Button onClick={() => router.push("/admin/surveys")}>
          Volver a Encuestas
        </Button>
      </div>
    );
  }

  const publicLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/survey/${survey.uniqueLink}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/surveys")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{survey.title}</h1>
            <p className="text-gray-600">{survey.description}</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informacion General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Tipo</p>
              <p className="font-medium">
                {survey.type === "teacher_evaluation" && "Evaluacion de Docentes"}
                {survey.type === "institutional" && "Institucional"}
                {survey.type === "custom" && "Personalizada"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estado</p>
              <span
                className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  survey.status === "active"
                    ? "bg-green-100 text-green-800"
                    : survey.status === "draft"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {survey.status === "active" && "Activa"}
                {survey.status === "draft" && "Borrador"}
                {survey.status === "closed" && "Cerrada"}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Respuestas recibidas</p>
              <p className="font-medium">{survey._count.responses}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Requiere codigo</p>
              <p className="font-medium">{survey.requiresCode ? "Si" : "No"}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Link publico</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={publicLink}
                readOnly
                className="flex-1 px-3 py-2 border rounded-md bg-gray-50"
              />
              <Button
                variant="outline"
                onClick={copyLink}
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(publicLink, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {survey.surveyTeachers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Docentes a Evaluar ({survey.surveyTeachers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {survey.surveyTeachers.map((st) => (
                <div
                  key={st.id}
                  className="border rounded-lg p-4 flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                    {st.teacher.photo ? (
                      <img
                        src={st.teacher.photo}
                        alt={st.teacher.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl text-gray-400">👤</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{st.teacher.name}</p>
                    {st.teacher.subject && (
                      <p className="text-sm text-gray-600 truncate">{st.teacher.subject}</p>
                    )}
                    {st.teacher.diplomatura && (
                      <p className="text-xs text-gray-500 truncate">{st.teacher.diplomatura}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Preguntas ({survey.questions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {survey.questions.map((q, index) => (
              <div key={q.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium mb-1">{q.question}</p>
                    {q.description && (
                      <p className="text-sm text-gray-600 mb-2">{q.description}</p>
                    )}
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        {q.type === "text" && "Texto corto"}
                        {q.type === "textarea" && "Texto largo"}
                        {q.type === "rating" && `Calificacion (${q.minValue}-${q.maxValue})`}
                        {q.type === "multiple_choice" && "Opcion unica"}
                        {q.type === "checkbox" && "Opcion multiple"}
                      </span>
                      {q.required && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
                          Obligatoria
                        </span>
                      )}
                    </div>
                    {(q.type === "multiple_choice" || q.type === "checkbox") &&
                      q.options && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Opciones:</p>
                          <ul className="text-sm space-y-1">
                            {Array.isArray(q.options) &&
                              q.options.map((opt: string, i: number) => (
                                <li key={i} className="text-gray-700">
                                  - {opt}
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/surveys/metrics")}
        >
          Ver Metricas
        </Button>
        <Button onClick={() => alert("Funcionalidad proximamente")}>
          Editar Encuesta
        </Button>
      </div>
    </div>
  );
}
