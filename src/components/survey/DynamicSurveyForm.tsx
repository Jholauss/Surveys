// src/components/survey/DynamicSurveyForm.tsx
'use client';

import { useState } from 'react';
import ProgressIndicator from '../ui/ProgressIndicator';
import BackButton from '../ui/BackButton';
import RatingSlider from '../ui/RatingSlider';

interface Question {
  id: string;
  type: string;
  question: string;
  description?: string;
  options?: any;
  required: boolean;
  minValue?: number;
  maxValue?: number;
  order: number;
}

interface Teacher {
  id: string;
  name: string;
  subject?: string;
  photo?: string;
}

interface DynamicSurveyFormProps {
  survey: {
    title: string;
    description?: string;
    questions: Question[];
  };
  teacher?: Teacher;
  onBack: () => void;
  onSubmit: (answers: Record<string, any>) => void | Promise<void>;
}

export default function DynamicSurveyForm({
  survey,
  teacher,
  onBack,
  onSubmit
}: DynamicSurveyFormProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar preguntas requeridas
    const requiredQuestions = survey.questions.filter(q => q.required);
    const missingAnswers = requiredQuestions.filter(
      q => !answers[q.id] && answers[q.id] !== 0
    );

    if (missingAnswers.length > 0) {
      alert('Por favor complete todas las preguntas obligatorias');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(answers);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#042254] focus:border-transparent"
            placeholder="Escriba su respuesta..."
            required={question.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#042254] focus:border-transparent"
            rows={4}
            placeholder="Escriba su respuesta..."
            required={question.required}
          />
        );

      case 'rating':
        return (
          <RatingSlider
            value={answers[question.id] || (question.minValue || 1)}
            onChange={(value) => handleAnswerChange(question.id, value)}
            max={question.maxValue || 5}
            min={question.minValue || 1}
            question=""
          />
        );

      case 'multiple_choice':
        const options = Array.isArray(question.options) ? question.options : [];
        return (
          <div className="space-y-2">
            {options.map((option: string, index: number) => (
              <label key={index} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="mr-2 text-[#042254] focus:ring-[#042254]"
                  required={question.required}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        const checkboxOptions = Array.isArray(question.options) ? question.options : [];
        const selectedOptions = answers[question.id] || [];
        return (
          <div className="space-y-2">
            {checkboxOptions.map((option: string, index: number) => (
              <label key={index} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={(e) => {
                    const newSelected = e.target.checked
                      ? [...selectedOptions, option]
                      : selectedOptions.filter((o: string) => o !== option);
                    handleAnswerChange(question.id, newSelected);
                  }}
                  className="mr-2 text-[#042254] focus:ring-[#042254]"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return <p className="text-red-500">Tipo de pregunta no soportado: {question.type}</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Encabezado azul oscuro */}
      <div className="bg-[#042254] py-8">
        <div className="max-w-md mx-auto text-center">
          <img
            src="/logo.svg"
            alt="Logo"
            className="h-16 w-auto mx-auto mb-4"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto p-6 mt-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <ProgressIndicator currentStep={3} />

          <BackButton onClick={onBack} />

          <div className="text-center mb-6">
            {teacher && (
              <div className="flex justify-center mb-4">
                <img
                  src={teacher.photo ? `/teachers/${teacher.photo}` : '/default-teacher.png'}
                  alt={teacher.name}
                  className="w-20 h-20 rounded-full border-4 border-[#042254] object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/100x100/042254/white?text=DOC';
                  }}
                />
              </div>
            )}
            <h1 className="text-2xl font-bold text-[#042254] mb-2">
              {teacher ? `Evaluación para ${teacher.name}` : survey.title}
            </h1>
            {survey.description && (
              <p className="text-gray-600">{survey.description}</p>
            )}
            {teacher?.subject && (
              <p className="text-sm text-gray-500 mt-1">{teacher.subject}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {survey.questions
              .sort((a, b) => a.order - b.order)
              .map((question) => (
                <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="mb-3">
                    <h3 className="font-medium text-gray-800">
                      {question.question}
                      {question.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h3>
                    {question.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {question.description}
                      </p>
                    )}
                  </div>
                  {renderQuestion(question)}
                </div>
              ))}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium disabled:opacity-50"
              >
                Atrás
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#042254] text-white py-3 rounded-lg hover:bg-[#031a42] transition-all duration-300 font-medium shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Evaluación'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
