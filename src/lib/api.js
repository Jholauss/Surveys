// src/lib/api.js

import { surveyDatabase, createEvaluation, createSession } from './database';
import { studentDatabase, diplomaturaTeachers } from './data';

// Simular llamadas a API con setTimeout
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Crear una nueva sesión de evaluación
  createSession: async (studentCode) => {
    await delay(300); // Simular latencia de red
    
    const student = studentDatabase[studentCode];
    if (!student) {
      throw new Error('Estudiante no encontrado');
    }
    
    let diplomaturaKey = '';
    switch(student.diplomatura) {
      case 'Diplomatura 1': diplomaturaKey = 'diploma1'; break;
      case 'Diplomatura 2': diplomaturaKey = 'diploma2'; break;
      case 'Diplomatura 3': diplomaturaKey = 'diploma3'; break;
      case 'Diplomatura 4': diplomaturaKey = 'diploma4'; break;
      default: diplomaturaKey = 'diploma1';
    }
    
    const teachers = diplomaturaTeachers[diplomaturaKey] || [];
    const session = createSession(studentCode, student.diplomatura, teachers);
    
    surveyDatabase.activeSessions.set(session.id, session);
    return session;
  },
  
  // Obtener sesión por ID
  getSession: async (sessionId) => {
    await delay(200);
    const session = surveyDatabase.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Sesión no encontrada');
    }
    return session;
  },
  
  // Crear evaluación para un docente
  createEvaluation: async (sessionId, teacherId, answers) => {
    await delay(300);
    
    const session = surveyDatabase.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Sesión no encontrada');
    }
    
    // Verificar que el docente pertenezca a la sesión
    if (!session.teachers.includes(teacherId)) {
      throw new Error('Docente no válido para esta sesión');
    }
    
    // Verificar que no se haya evaluado ya
    if (session.evaluatedTeachers.includes(teacherId)) {
      throw new Error('Docente ya evaluado');
    }
    
    const evaluation = createEvaluation(session.studentCode, teacherId, session.diplomatura);
    evaluation.answers = answers;
    evaluation.completed = true;
    
    // Guardar evaluación
    surveyDatabase.allEvaluations.set(evaluation.id, evaluation);
    
    // Actualizar sesión
    session.evaluatedTeachers.push(teacherId);
    session.completed = session.evaluatedTeachers.length === session.teachers.length;
    
    // Guardar en evaluaciones por estudiante
    const studentEvals = surveyDatabase.studentEvaluations.get(session.studentCode) || [];
    studentEvals.push(evaluation.id);
    surveyDatabase.studentEvaluations.set(session.studentCode, studentEvals);
    
    return evaluation;
  },
  
  // Obtener evaluaciones de un estudiante
  getStudentEvaluations: async (studentCode) => {
    await delay(200);
    const evalIds = surveyDatabase.studentEvaluations.get(studentCode) || [];
    return evalIds.map(id => surveyDatabase.allEvaluations.get(id));
  },
  
  // ✅ NUEVA FUNCIÓN: Verificar si un estudiante completó todas las evaluaciones
  hasCompletedAllEvaluations: async (studentCode) => {
    await delay(200);
    const student = studentDatabase[studentCode];
    if (!student) return false;
    
    let diplomaturaKey = '';
    switch(student.diplomatura) {
      case 'Diplomatura 1': diplomaturaKey = 'diploma1'; break;
      case 'Diplomatura 2': diplomaturaKey = 'diploma2'; break;
      case 'Diplomatura 3': diplomaturaKey = 'diploma3'; break;
      case 'Diplomatura 4': diplomaturaKey = 'diploma4'; break;
      default: diplomaturaKey = 'diploma1';
    }
    
    const totalTeachers = diplomaturaTeachers[diplomaturaKey]?.length || 0;
    const evalIds = surveyDatabase.studentEvaluations.get(studentCode) || [];
    return evalIds.length >= totalTeachers;
  }
};