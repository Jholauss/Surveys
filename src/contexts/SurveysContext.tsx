// src/contexts/SurveysContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Teacher {
  id: string;
  name: string;
  subject: string;
  photo: string;
  diplomatura: string;
}

interface Question {
  id: string;
  type: string;
  question: string;
  options: string[];
  required: boolean;
}

interface Survey {
  id: string;
  name: string;
  description: string;
  teacherCount: number;
  teachers: Teacher[];
  questions: Question[];
  createdAt: string;
  active: boolean;
}

interface SurveysContextType {
  surveys: Survey[];
  addSurvey: (survey: Survey) => void;
  deleteSurvey: (id: string) => void;
  updateSurvey: (id: string, survey: Survey) => void;
}

const SurveysContext = createContext<SurveysContextType | undefined>(undefined);

export function SurveysProvider({ children }: { children: ReactNode }) {
  const [surveys, setSurveys] = useState<Survey[]>([]);

  const addSurvey = (survey: Survey) => {
    setSurveys(prev => [...prev, survey]);
  };

  const deleteSurvey = (id: string) => {
    setSurveys(prev => prev.filter(s => s.id !== id));
  };

  const updateSurvey = (id: string, updatedSurvey: Survey) => {
    setSurveys(prev => prev.map(s => s.id === id ? updatedSurvey : s));
  };

  return (
    <SurveysContext.Provider value={{ surveys, addSurvey, deleteSurvey, updateSurvey }}>
      {children}
    </SurveysContext.Provider>
  );
}

export function useSurveys() {
  const context = useContext(SurveysContext);
  if (context === undefined) {
    throw new Error('useSurveys must be used within a SurveysProvider');
  }
  return context;
}