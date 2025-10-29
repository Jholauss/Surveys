// src/app/admin/surveys/create/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, X } from "lucide-react";

export default function CreateSurveyPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("teacher_evaluation");
  const [status, setStatus] = useState("draft");
  const [requiresCode, setRequiresCode] = useState(true);

  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [maxTeachers, setMaxTeachers] = useState<number>(0);

  const [questions, setQuestions] = useState<any[]>([
    {
      type: "rating",
      question: "¿Cómo calificaría el dominio del tema por parte del docente?",
      required: true,
      minValue: 1,
      maxValue: 5,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    const res = await fetch("/api/admin/teachers");
    const data = await res.json();
    if (res.ok) {
      setTeachers(data.teachers || []);
    }
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { type: "text", question: "Nueva pregunta", required: true },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || questions.length === 0) {
      alert("Complete todos los campos requeridos");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          type,
          status,
          requiresCode,
          questions,
          teacherIds: selectedTeachers,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Encuesta creada! Link: ${data.publicLink}`);
        router.push("/admin/surveys");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear encuesta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Crear Nueva Encuesta</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info Básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher_evaluation">
                      Evaluación de Docentes
                    </SelectItem>
                    <SelectItem value="institutional">Institucional</SelectItem>
                    <SelectItem value="custom">Personalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Estado</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="active">Activa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="requiresCode"
                checked={requiresCode}
                onChange={(e) => setRequiresCode(e.target.checked)}
              />
              <Label htmlFor="requiresCode">Requiere código de estudiante</Label>
            </div>
          </CardContent>
        </Card>

        {/* Docentes */}
        {type === "teacher_evaluation" && (
          <Card>
            <CardHeader>
              <CardTitle>Docentes a Evaluar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="maxTeachers">¿Cuántos docentes desea evaluar? *</Label>
                <Input
                  id="maxTeachers"
                  type="number"
                  min="0"
                  max={teachers.length}
                  value={maxTeachers}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setMaxTeachers(value);
                    if (selectedTeachers.length > value) {
                      setSelectedTeachers(selectedTeachers.slice(0, value));
                    }
                  }}
                  placeholder="Ej: 3"
                  className="max-w-xs"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {selectedTeachers.length} de {maxTeachers} docentes seleccionados
                </p>
              </div>

              {maxTeachers > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teachers.map((teacher) => {
                    const isSelected = selectedTeachers.includes(teacher.id);
                    const canSelect = isSelected || selectedTeachers.length < maxTeachers;

                    return (
                      <div
                        key={teacher.id}
                        onClick={() => {
                          if (!canSelect && !isSelected) return;

                          if (isSelected) {
                            setSelectedTeachers((prev) =>
                              prev.filter((id) => id !== teacher.id)
                            );
                          } else {
                            setSelectedTeachers((prev) => [...prev, teacher.id]);
                          }
                        }}
                        className={`
                          relative border-2 rounded-lg p-4 cursor-pointer transition-all
                          ${isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : canSelect
                              ? 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                              : 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'}
                        `}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                            ✓
                          </div>
                        )}

                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            {teacher.photo ? (
                              <img
                                src={teacher.photo}
                                alt={teacher.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-3xl text-gray-400">👤</span>
                            )}
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm">{teacher.name}</h4>
                            {teacher.subject && (
                              <p className="text-xs text-gray-600">{teacher.subject}</p>
                            )}
                            {teacher.diplomatura && (
                              <p className="text-xs text-gray-500">{teacher.diplomatura}</p>
                            )}
                          </div>
                        </div>

                        {!canSelect && !isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-lg">
                            <span className="text-xs text-gray-600 font-medium">
                              Límite alcanzado
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {maxTeachers > 0 && teachers.length === 0 && (
                <p className="text-sm text-gray-500">
                  No hay docentes disponibles. Agregue docentes primero.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Preguntas */}
        <Card>
          <CardHeader>
            <CardTitle>Preguntas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((q, i) => (
              <div key={i} className="border p-4 rounded space-y-3">
                <div className="flex justify-between">
                  <h4 className="font-medium">Pregunta {i + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveQuestion(i)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div>
                  <Label>Tipo</Label>
                  <Select
                    value={q.type}
                    onValueChange={(v) => handleQuestionChange(i, "type", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="textarea">Texto Largo</SelectItem>
                      <SelectItem value="rating">Calificación</SelectItem>
                      <SelectItem value="multiple_choice">Opción Única</SelectItem>
                      <SelectItem value="checkbox">Opción Múltiple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Pregunta *</Label>
                  <Input
                    value={q.question}
                    onChange={(e) =>
                      handleQuestionChange(i, "question", e.target.value)
                    }
                    required
                  />
                </div>

                {(q.type === "multiple_choice" || q.type === "checkbox") && (
                  <div>
                    <Label>Opciones (separadas por coma)</Label>
                    <Input
                      placeholder="Opción 1, Opción 2, Opción 3"
                      onChange={(e) =>
                        handleQuestionChange(
                          i,
                          "options",
                          e.target.value.split(",").map((o) => o.trim())
                        )
                      }
                    />
                  </div>
                )}

                {q.type === "rating" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Mín</Label>
                      <Input
                        type="number"
                        value={q.minValue || 1}
                        onChange={(e) =>
                          handleQuestionChange(i, "minValue", parseInt(e.target.value))
                        }
                      />
                    </div>
                    <div>
                      <Label>Máx</Label>
                      <Input
                        type="number"
                        value={q.maxValue || 5}
                        onChange={(e) =>
                          handleQuestionChange(i, "maxValue", parseInt(e.target.value))
                        }
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={q.required}
                    onChange={(e) =>
                      handleQuestionChange(i, "required", e.target.checked)
                    }
                  />
                  <Label>Obligatoria</Label>
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={handleAddQuestion}>
              <Plus className="w-4 h-4 mr-2" />
              Añadir Pregunta
            </Button>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/surveys")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear Encuesta"}
          </Button>
        </div>
      </form>
    </div>
  );
}
