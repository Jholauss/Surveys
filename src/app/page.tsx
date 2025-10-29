// src/app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check, ArrowLeft, AlertTriangle } from 'lucide-react';
import StudentCodeForm from '@/components/survey/StudentCodeForm';
import TeacherSelection from '@/components/survey/TeacherSelection';
import SurveyForm from '@/components/survey/SurveyForm';
import SuccessModal from '@/components/survey/SuccessModal';
import Notification from '@/components/ui/Notification';
import { api } from '@/lib/api';
import { studentDatabase, diplomaturaTeachers } from '@/lib/data';

export default function SurveyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');
  
  const [currentView, setCurrentView] = useState('studentForm');
  const [studentCode, setStudentCode] = useState('');
  const [displayedCode, setDisplayedCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [selectedDiplomatura, setSelectedDiplomatura] = useState('');
  const [selectedDiplomaturaName, setSelectedDiplomaturaName] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [dominioRating, setDominioRating] = useState(3);
  const [claridadRating, setClaridadRating] = useState(3);
  const [showNotification, setShowNotification] = useState({ show: false, message: '', type: '' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Estado de la sesión
  const [currentSession, setCurrentSession] = useState(null);

  // Cargar sesión desde URL si existe
  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId);
    }
  }, [sessionId]);

  const loadSession = async (sessionId) => {
    try {
      const session = await api.getSession(sessionId);
      const student = studentDatabase[session.studentCode];
      
      setCurrentSession(session);
      setStudentCode(session.studentCode);
      setDisplayedCode(session.studentCode);
      setStudentName(student.name);
      setSelectedDiplomaturaName(session.diplomatura);
      
      // Determinar diplomatura key
      let diplomaturaKey = '';
      switch(session.diplomatura) {
        case 'Diplomatura 1': diplomaturaKey = 'diploma1'; break;
        case 'Diplomatura 2': diplomaturaKey = 'diploma2'; break;
        case 'Diplomatura 3': diplomaturaKey = 'diploma3'; break;
        case 'Diplomatura 4': diplomaturaKey = 'diploma4'; break;
        default: diplomaturaKey = 'diploma1';
      }
      
      setSelectedDiplomatura(diplomaturaKey);
      setCurrentView('teacherSelection');
    } catch (error) {
      setShowNotification({
        show: true,
        message: 'Sesión no válida o expirada.',
        type: 'error'
      });
      setTimeout(() => {
        router.push('/?error=invalid_session');
      }, 3000);
    }
  };

  const isValidCodeFormat = (code) => {
    return code.length === 10 && /^[A-Z0-9]+$/.test(code);
  };

  const handleCodeSubmit = async () => {
    if (!isValidCodeFormat(studentCode)) {
      setShowNotification({
        show: true,
        message: 'El código debe tener exactamente 10 caracteres (letras mayúsculas y números).',
        type: 'error'
      });
      setTimeout(() => setShowNotification({ show: false, message: '', type: '' }), 4000);
      return;
    }

    const code = studentCode.toUpperCase();
    
    try {
      // Verificar si ya completó todas las evaluaciones
      const hasCompleted = await api.hasCompletedAllEvaluations(code);
      if (hasCompleted) {
        setShowNotification({
          show: true,
          message: 'Ya ha completado todas las evaluaciones para su diplomatura.',
          type: 'success'
        });
        setTimeout(() => setShowNotification({ show: false, message: '', type: '' }), 4000);
        return;
      }
      
      // Crear nueva sesión
      const session = await api.createSession(code);
      setCurrentSession(session);
      
      const studentData = studentDatabase[code];
      setDisplayedCode(code);
      setStudentName(studentData.name);
      
      let diplomaturaKey = '';
      switch(studentData.diplomatura) {
        case 'Diplomatura 1': diplomaturaKey = 'diploma1'; break;
        case 'Diplomatura 2': diplomaturaKey = 'diploma2'; break;
        case 'Diplomatura 3': diplomaturaKey = 'diploma3'; break;
        case 'Diplomatura 4': diplomaturaKey = 'diploma4'; break;
        default: diplomaturaKey = 'diploma1';
      }
      
      setSelectedDiplomatura(diplomaturaKey);
      setSelectedDiplomaturaName(studentData.diplomatura);
      
      // Actualizar URL con ID de sesión
      router.push(`/?session=${session.id}`);
      
    } catch (error) {
      setShowNotification({
        show: true,
        message: error.message || 'Código de estudiante no válido. Por favor verifique e intente nuevamente.',
        type: 'error'
      });
      setTimeout(() => setShowNotification({ show: false, message: '', type: '' }), 4000);
    }
  };

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher({ ...teacher, diplomatura: selectedDiplomaturaName, diplomaturaKey: selectedDiplomatura });
    setCurrentView('surveyPreview');
  };

  const handleTeacherEvaluationSubmit = async (e) => {
  e.preventDefault();
  
  if (!currentSession) {
    setShowNotification({
      show: true,
      message: 'Sesión no válida. Por favor inicie nuevamente.',
      type: 'error'
    });
    return;
  }
  
  try {
    const answers = {
      dominio: dominioRating,
      claridad: claridadRating,
      // Aquí irían las otras respuestas
    };
    
    const evaluation = await api.createEvaluation(currentSession.id, selectedTeacher.id, answers);
    
    const hasCompleted = await api.hasCompletedAllEvaluations(currentSession.studentCode);
    
    if (hasCompleted) {
      setShowSuccessModal(true);
      setTimeout(() => {
        resetAllStates();
        router.push('/');
        setShowSuccessModal(false);
      }, 3000);
    } else {
      setSelectedTeacher(null);
      setCurrentView('teacherSelection');
      
      setShowNotification({
        show: true,
        message: `Evaluación para ${selectedTeacher.name} enviada con éxito.`,
        type: 'success'
      });
      setTimeout(() => setShowNotification({ show: false, message: '', type: '' }), 3000);
    }
  } catch (error) {
    setShowNotification({
      show: true,
      message: error.message || 'Error al guardar la evaluación. Intente nuevamente.',
      type: 'error'
    });
    setTimeout(() => setShowNotification({ show: false, message: '', type: '' }), 4000);
  }
};

  const handleBackToCodeForm = () => {
    resetAllStates();
    router.push('/');
  };

  const resetAllStates = () => {
    setStudentCode('');
    setDisplayedCode('');
    setStudentName('');
    setSelectedDiplomatura('');
    setSelectedDiplomaturaName('');
    setSelectedTeacher(null);
    setDominioRating(3);
    setClaridadRating(3);
    setCurrentSession(null);
  };

  // Renderizado correcto
  return (
    <>
      {currentView === 'studentForm' && (
        <StudentCodeForm 
          onSubmit={handleCodeSubmit} 
          onCodeChange={setStudentCode}
          currentCode={studentCode}
        />
      )}

      {currentView === 'teacherSelection' && currentSession && (
        <TeacherSelection 
          studentName={studentName}
          displayedCode={displayedCode}
          diplomaturaName={selectedDiplomaturaName}
          teachers={diplomaturaTeachers[selectedDiplomatura] || []}  // <-- PASAMOS LOS DOCENTES AQUÍ
          evaluatedTeachers={currentSession.evaluatedTeachers}
          onBack={handleBackToCodeForm}
          onSelectTeacher={handleTeacherSelect}
        />
      )}

      {currentView === 'surveyPreview' && selectedTeacher && (
        <SurveyForm 
          teacher={selectedTeacher}
          diplomatura={selectedTeacher.diplomatura}
          onBack={() => setCurrentView('teacherSelection')}
          onSubmit={handleTeacherEvaluationSubmit}
          dominioRating={dominioRating}
          claridadRating={claridadRating}
          setDominioRating={setDominioRating}
          setClaridadRating={setClaridadRating}
        />
      )}

      <Notification 
        show={showNotification.show} 
        message={showNotification.message} 
        type={showNotification.type} 
      />

      <SuccessModal 
        show={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
    </>
  );
}