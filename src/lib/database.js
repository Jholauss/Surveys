// src/lib/database.js

// Simulamos una base de datos con Map para mejor rendimiento
export const surveyDatabase = {
  // Evaluaciones por estudiante
  studentEvaluations: new Map(),
  
  // Todas las evaluaciones (para análisis)
  allEvaluations: new Map(),
  
  // Sesiones activas
  activeSessions: new Map()
};

// Estructura de una evaluación
export const createEvaluation = (studentCode, teacherId, diplomatura) => ({
  id: `EVAL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  studentCode,
  teacherId,
  diplomatura,
  timestamp: new Date().toISOString(),
  answers: {},
  completed: false
});

// Estructura de una sesión
export const createSession = (studentCode, diplomatura, teachers) => ({
  id: `SESSION-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  studentCode,
  diplomatura,
  teachers: teachers.map(t => t.id),
  evaluatedTeachers: [],
  createdAt: new Date().toISOString(),
  completed: false
});