// src/components/survey/TeacherSelection.jsx

import ProgressIndicator from '../ui/ProgressIndicator';
import BackButton from '../ui/BackButton';
import { Check } from 'lucide-react';

export default function TeacherSelection({ 
  studentName,
  displayedCode,
  diplomaturaName,
  teachers,           // <-- ESTE ES EL CAMBIO CLAVE
  evaluatedTeachers,
  onBack, 
  onSelectTeacher 
}) {
  // Calcular progreso de evaluación
  const totalTeachers = teachers.length;
  const evaluatedCount = evaluatedTeachers.length;
  const progressPercentage = totalTeachers > 0 ? Math.round((evaluatedCount / totalTeachers) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Encabezado azul oscuro */}
      <div className="bg-[#042254] py-8">
        <div className="max-w-md mx-auto text-center">
          <img 
            src="/logo.svg" 
            alt="Pontificia Universidad Católica del Perú" 
            className="h-16 w-auto mx-auto mb-4"
            onError={(e) => {
              e.target.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'text-2xl font-bold text-white mb-2';
              fallback.textContent = 'PUCP';
              e.target.parentNode.appendChild(fallback);
            }}
          />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto p-6 mt-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <ProgressIndicator currentStep={2} />
          
          <BackButton onClick={onBack} />
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-[#042254] mb-2">
              Bienvenido, {studentName}!
            </h2>
            <p className="text-gray-600">Seleccione el docente que desea evaluar</p>
            <div className="text-sm text-gray-500 mt-2">
              <span className="font-medium">Diplomatura:</span> {diplomaturaName} • 
              <span className="font-mono bg-gray-100 px-2 py-1 rounded ml-2">{displayedCode}</span>
            </div>
            
            {/* Barra de progreso de evaluación */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progreso de evaluación</span>
                <span>{evaluatedCount}/{totalTeachers} docentes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#042254] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map((teacher, index) => {
              const isEvaluated = evaluatedTeachers.includes(teacher.id);
              
              return (
                <div 
                  key={index}
                  className={`border-2 rounded-lg p-4 transition-colors cursor-pointer ${
                    isEvaluated 
                      ? 'border-green-500 bg-green-50 opacity-75' 
                      : 'border-gray-200 hover:border-[#042254] hover:bg-blue-50'
                  }`}
                  onClick={() => !isEvaluated && onSelectTeacher(teacher)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={`/teachers/${teacher.photo}`} 
                        alt={teacher.name} 
                        className="w-16 h-16 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/80x80/042254/white?text=DOC';
                        }}
                      />
                      {isEvaluated && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <Check size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold ${
                        isEvaluated ? 'text-green-800 line-through' : 'text-gray-800'
                      }`}>
                        {teacher.name}
                      </h3>
                      <p className={`text-sm ${
                        isEvaluated ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {teacher.subject}
                      </p>
                    </div>
                  </div>
                  {isEvaluated && (
                    <div className="mt-2 text-center">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Evaluado ✓
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}