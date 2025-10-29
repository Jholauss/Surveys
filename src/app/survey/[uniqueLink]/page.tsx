// src/app/survey/[uniqueLink]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import StudentCodeForm from '@/components/survey/StudentCodeForm';
import TeacherSelection from '@/components/survey/TeacherSelection';
import DynamicSurveyForm from '@/components/survey/DynamicSurveyForm';
import SuccessModal from '@/components/survey/SuccessModal';
import Notification from '@/components/ui/Notification';

export default function PublicSurveyPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const uniqueLink = params.uniqueLink as string;
  const sessionToken = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [currentView, setCurrentView] = useState('studentForm');
  const [studentCode, setStudentCode] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Cargar encuesta
  useEffect(() => {
    loadSurvey();
  }, [uniqueLink]);

  // Cargar sesión si existe token
  useEffect(() => {
    if (sessionToken) {
      loadSession(sessionToken);
    }
  }, [sessionToken]);

  const loadSurvey = async () => {
    try {
      const res = await fetch(`/api/survey/${uniqueLink}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al cargar la encuesta');
      }

      setSurvey(data.survey);
      setLoading(false);
    } catch (error: any) {
      showNotification(error.message, 'error');
      setLoading(false);
    }
  };

  const loadSession = async (token: string) => {
    try {
      const res = await fetch(`/api/survey/${uniqueLink}/session?token=${token}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Sesión inválida');
      }

      console.log('[Frontend] Sesión cargada:', data.session);
      console.log('[Frontend] Docentes recibidos:', data.session.teachers);
      console.log('[Frontend] Cantidad de docentes:', data.session.teachers?.length || 0);

      setSession(data.session);
      setCurrentView('teacherSelection');
    } catch (error: any) {
      showNotification(error.message, 'error');
      // Volver al formulario de código
      setCurrentView('studentForm');
    }
  };

  const handleCodeSubmit = async () => {
    if (studentCode.length !== 8) {
      showNotification('El código debe tener exactamente 8 caracteres', 'error');
      return;
    }

    try {
      const res = await fetch(`/api/survey/${uniqueLink}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentCode: studentCode.toUpperCase() })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al validar código');
      }

      console.log('[Frontend] Sesión creada:', data.session);
      console.log('[Frontend] Docentes recibidos:', data.session.teachers);
      console.log('[Frontend] Cantidad de docentes:', data.session.teachers?.length || 0);

      setSession(data.session);

      // Actualizar URL con token
      window.history.pushState({}, '', `?token=${data.session.token}`);

      setCurrentView('teacherSelection');
    } catch (error: any) {
      showNotification(error.message, 'error');
    }
  };

  const handleTeacherSelect = (teacher: any) => {
    setSelectedTeacher(teacher);
    setCurrentView('surveyForm');
  };

  const handleSurveySubmit = async (answers: any) => {
    try {
      const res = await fetch(`/api/survey/${uniqueLink}/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken: session.token,
          teacherId: selectedTeacher?.id,
          answers
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar respuesta');
      }

      // Verificar si completó todas las evaluaciones
      if (data.session.allCompleted) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          setCurrentView('studentForm');
          setSession(null);
          setStudentCode('');
          window.history.pushState({}, '', window.location.pathname);
        }, 3000);
      } else {
        showNotification(
          `Evaluación completada. ${data.session.totalTeachers - data.session.evaluatedCount} docentes restantes.`,
          'success'
        );
        setSelectedTeacher(null);
        setCurrentView('teacherSelection');

        // Recargar sesión para actualizar docentes evaluados
        loadSession(session.token);
      }
    } catch (error: any) {
      showNotification(error.message, 'error');
    }
  };

  const showNotification = (message: string, type: string) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 4000);
  };

  const handleBack = () => {
    if (currentView === 'surveyForm') {
      setCurrentView('teacherSelection');
      setSelectedTeacher(null);
    } else {
      setCurrentView('studentForm');
      setSession(null);
      setStudentCode('');
      window.history.pushState({}, '', window.location.pathname);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Cargando encuesta...</p>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">Encuesta no encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentView === 'studentForm' && (
        <StudentCodeForm
          onSubmit={handleCodeSubmit}
          onCodeChange={setStudentCode}
          currentCode={studentCode}
        />
      )}

      {currentView === 'teacherSelection' && session && (
        <TeacherSelection
          studentName={session.student?.name || 'Anónimo'}
          displayedCode={session.student?.code || ''}
          diplomaturaName={session.student?.diplomatura || survey.title}
          teachers={session.teachers || []}
          evaluatedTeachers={session.evaluatedTeacherIds || []}
          onBack={handleBack}
          onSelectTeacher={handleTeacherSelect}
        />
      )}

      {currentView === 'surveyForm' && selectedTeacher && survey && (
        <DynamicSurveyForm
          survey={survey}
          teacher={selectedTeacher}
          onBack={handleBack}
          onSubmit={handleSurveySubmit}
        />
      )}

      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
      />

      <SuccessModal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
}
