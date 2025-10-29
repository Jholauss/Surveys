// src/lib/database/admin-db.ts

export interface SurveyTemplate {
  id: string;
  title: string;
  description: string;
  type: 'teacher_evaluation' | 'hiring' | 'institutional';
  questions: SurveyQuestion[];
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface SurveyQuestion {
  id: string;
  type: 'text' | 'rating' | 'multiple_choice' | 'checkbox';
  question: string;
  options?: string[];
  required: boolean;
}

export interface AdminSurveyResponse {
  id: string;
  surveyId: string;
  respondentId: string;
  respondentType: 'student' | 'applicant' | 'staff';
  answers: Record<string, any>;
  submittedAt: string;
  metadata: {
    ip?: string;
    userAgent?: string;
    session?: string;
  };
}

export interface AdminTeacher {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  diplomatura: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

// Simulación de base de datos en memoria (en producción usaría PostgreSQL/MongoDB)
export const adminDatabase = {
  surveyTemplates: new Map<string, SurveyTemplate>(),
  surveyResponses: new Map<string, AdminSurveyResponse>(),
  teachers: new Map<string, AdminTeacher>(),
  
  // Métodos CRUD
  createSurveyTemplate: (template: SurveyTemplate) => {
    adminDatabase.surveyTemplates.set(template.id, template);
    return template;
  },
  
  getSurveyTemplates: () => {
    return Array.from(adminDatabase.surveyTemplates.values());
  },
  
  createSurveyResponse: (response: AdminSurveyResponse) => {
    adminDatabase.surveyResponses.set(response.id, response);
    return response;
  },
  
  getSurveyResponses: (surveyId?: string) => {
    const responses = Array.from(adminDatabase.surveyResponses.values());
    return surveyId ? responses.filter(r => r.surveyId === surveyId) : responses;
  },
  
  createTeacher: (teacher: AdminTeacher) => {
    adminDatabase.teachers.set(teacher.id, teacher);
    return teacher;
  },
  
  getTeachers: () => {
    return Array.from(adminDatabase.teachers.values());
  }
};