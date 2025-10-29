"use client";

import { useState } from "react";
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
import { Plus, Trash2, X, Search } from "lucide-react";
import { diplomaturaTeachers } from "@/lib/data";

// Tipos
interface Teacher {
  id: string;
  name: string;
  subject: string;
  photo: string;
  diplomatura: string;
}

interface Question {
  id: string;
  type: "rating" | "text" | "multiple_choice" | "checkbox";
  question: string;
  options: string[];
  required: boolean;
}

export default function CreateSurveyPage() {
  const router = useRouter();

  // Estados principales
  const [surveyName, setSurveyName] = useState<string>("");
  const [surveyDescription, setSurveyDescription] = useState<string>("");
  const [teacherCount, setTeacherCount] = useState<string>("");
  const [selectedTeachers, setSelectedTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Estado preguntas
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: Date.now().toString(),
      type: "rating",
      question: "¿Cómo calificaría el dominio del tema por parte del docente?",
      options: [],
      required: true,
    },
  ]);

  // Todos los docentes disponibles
  const allTeachers: Teacher[] = Object.entries(diplomaturaTeachers).flatMap(
    ([diplomaturaKey, teachers]) =>
      teachers.map((t) => ({
        ...t,
        diplomatura: diplomaturaKey,
      }))
  );

  // Seleccionar docente
  const handleSelectTeacher = (teacher: Teacher): void => {
    const maxTeachers = parseInt(teacherCount || "0");
    if (maxTeachers > 0 && selectedTeachers.length < maxTeachers) {
      if (!selectedTeachers.find((t) => t.id === teacher.id)) {
        setSelectedTeachers((prev) => [...prev, teacher]);
      }
    }
  };

  // Remover docente
  const handleRemoveTeacher = (teacherId: string): void => {
    setSelectedTeachers((prev) => prev.filter((t) => t.id !== teacherId));
  };

  // Preguntas
  const handleAddQuestion = (): void => {
    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "text",
        question: "Nueva pregunta",
        options: [],
        required: true,
      },
    ]);
  };

  const handleRemoveQuestion = (questionId: string): void => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const handleQuestionChange = (
    questionId: string,
    field: keyof Question,
    value: any
  ): void => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, [field]: value } : q))
    );
  };

  const handleAddOption = (questionId: string): void => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (
          q.id === questionId &&
          (q.type === "multiple_choice" || q.type === "checkbox")
        ) {
          return {
            ...q,
            options: [...q.options, `Opción ${q.options.length + 1}`],
          };
        }
        return q;
      })
    );
  };

  const handleRemoveOption = (questionId: string, optionIndex: number): void => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...q.options];
          newOptions.splice(optionIndex, 1);
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  // Guardar encuesta
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const maxTeachers = parseInt(teacherCount || "0");
    if (!surveyName || maxTeachers <= 0 || selectedTeachers.length === 0) {
      alert("Por favor complete todos los campos requeridos");
      return;
    }

    if (selectedTeachers.length !== maxTeachers) {
      alert(`Debe seleccionar exactamente ${maxTeachers} docente(s)`);
      return;
    }

    const surveyData = {
      id: `SURVEY-${Date.now()}`,
      name: surveyName,
      description: surveyDescription,
      teacherCount: maxTeachers,
      teachers: selectedTeachers,
      questions,
      createdAt: new Date().toISOString(),
      active: true,
    };

    console.log("Encuesta creada:", surveyData);
    router.push("/admin/surveys");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Crear Nueva Encuesta</h1>
        <p className="text-gray-600">Configure los detalles de su encuesta</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información de la Encuesta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="surveyName">Nombre de la Encuesta *</Label>
                <Input
                  id="surveyName"
                  value={surveyName}
                  onChange={(e) => setSurveyName(e.target.value)}
                  placeholder="Ej: Evaluación Docente 2024"
                  required
                />
              </div>
              <div>
                <Label htmlFor="teacherCount">Cantidad de Docentes *</Label>
                <Input
                  id="teacherCount"
                  type="number"
                  min="1"
                  max="10"
                  value={teacherCount}
                  onChange={(e) => setTeacherCount(e.target.value)}
                  placeholder="3"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="surveyDescription">Descripción</Label>
              <textarea
                id="surveyDescription"
                value={surveyDescription}
                onChange={(e) => setSurveyDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[100px]"
                placeholder="Describa el propósito de esta encuesta..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Docentes */}
        <Card>
          <CardHeader>
            <CardTitle>Docentes para la Encuesta</CardTitle>
            <p className="text-sm text-gray-600">
              Seleccione exactamente {teacherCount || "0"} docente(s) para esta encuesta
            </p>
          </CardHeader>
          <CardContent>
            {selectedTeachers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Docentes Seleccionados ({selectedTeachers.length}/{teacherCount || "0"})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTeachers.map((teacher) => (
                    <div
                      key={teacher.id}
                      className="flex items-center gap-2 bg-blue-100 px-3 py-2 rounded-full"
                    >
                      <img
                        src={
                          teacher.photo?.startsWith("/teachers/")
                            ? teacher.photo
                            : teacher.photo || "/teachers/default.jpg"
                        }
                        alt={teacher.name}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/40x40/042254/white?text=DOC";
                        }}
                      />
                      <span className="text-sm font-medium">{teacher.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTeacher(teacher.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Barra de búsqueda */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar docente por nombre o código PUCP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Docentes disponibles */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Docentes Disponibles</h3>
              {parseInt(teacherCount || "0") <= 0 ? (
                <p className="text-sm text-gray-500">Ingrese la cantidad de docentes primero</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allTeachers
                    .filter((t) => !selectedTeachers.find((s) => s.id === t.id))
                    .filter(
                      (t) =>
                        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        t.id.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((teacher) => (
                      <div
                        key={teacher.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedTeachers.length >= parseInt(teacherCount || "0")
                            ? "border-gray-300 opacity-50 cursor-not-allowed"
                            : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                        }`}
                        onClick={() => handleSelectTeacher(teacher)}
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={`/teachers/${teacher.photo}`}
                            alt={teacher.name}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/48x48/042254/white?text=DOC";
                            }}
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{teacher.name}</h4>
                            <p className="text-sm text-gray-600">{teacher.subject}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preguntas */}
        <Card>
          <CardHeader>
            <CardTitle>Preguntas de la Encuesta</CardTitle>
            <p className="text-sm text-gray-600">
              Configure las preguntas que aparecerán en la encuesta
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-900">Pregunta {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveQuestion(question.id)}
                    className="text-red-600 hover:text-red-800 h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Tipo de Pregunta</Label>
                    <Select
                      value={question.type}
                      onValueChange={(value) =>
                        handleQuestionChange(question.id, "type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Calificación (1-5)</SelectItem>
                        <SelectItem value="text">Respuesta de texto</SelectItem>
                        <SelectItem value="multiple_choice">Opción única</SelectItem>
                        <SelectItem value="checkbox">Opción múltiple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Texto de la Pregunta *</Label>
                    <Input
                      value={question.question}
                      onChange={(e) =>
                        handleQuestionChange(question.id, "question", e.target.value)
                      }
                      placeholder="Escriba su pregunta..."
                      required
                    />
                  </div>

                  {(question.type === "multiple_choice" || question.type === "checkbox") && (
                    <div>
                      <Label>Opciones</Label>
                      <div className="space-y-2 mt-2">
                        {question.options.map((option, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...question.options];
                                newOptions[index] = e.target.value;
                                handleQuestionChange(question.id, "options", newOptions);
                              }}
                              placeholder={`Opción ${index + 1}`}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveOption(question.id, index)}
                              className="text-red-600 hover:text-red-800 h-8 w-8 p-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddOption(question.id)}
                          className="text-[#042254] border-[#042254] mt-2"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Añadir Opción
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`required-${question.id}`}
                      checked={question.required}
                      onChange={(e) =>
                        handleQuestionChange(question.id, "required", e.target.checked)
                      }
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-[#042254] focus:ring-[#042254]"
                    />
                    <Label htmlFor={`required-${question.id}`}>Pregunta obligatoria</Label>
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={handleAddQuestion}
              className="text-[#042254] border-[#042254]"
            >
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
          <Button type="submit" className="bg-[#042254] hover:bg-[#031a42]">
            Crear Encuesta
          </Button>
        </div>
      </form>
    </div>
  );
}
