
import { useState } from 'react';
import CodeInputField from './CodeInputField';

export default function StudentCodeForm({ onSubmit, onCodeChange, currentCode = '' }) {
  const [studentCode, setStudentCode] = useState(currentCode);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleCodeChange = (newCode) => {
    setStudentCode(newCode);
    onCodeChange(newCode);
  };

  // Validar si el código tiene el formato correcto (8 caracteres)
  const isValidCode = (code) => {
    return code.length === 8 && /^[A-Z0-9]+$/.test(code);
  };

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
              // Fallback si el SVG no carga
              e.target.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'text-2xl font-bold text-white mb-2';
              fallback.textContent = 'PUCP';
              e.target.parentNode.appendChild(fallback);
            }}
          />
        </div>
      </div>

      {/* Formulario blanco */}
      <div className="max-w-md mx-auto p-6 mt-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[#042254] mb-2">Evaluación de Docentes</h1>
            <p className="text-gray-600">Sistema de evaluación docente - PUCP</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Eliminamos el label duplicado */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#042254] mb-2">
                Código de Alumno
              </label>
              <CodeInputField
                value={studentCode}
                onChange={handleCodeChange}
                length={8}
              />

              {/* Mensaje de estado del código */}
              {studentCode.length > 0 && studentCode.length < 8 && (
                <p className="text-xs text-yellow-600 text-center mt-2">
                  Complete los 8 caracteres • Solo letras mayúsculas y números
                </p>
              )}

              {studentCode.length === 8 && !isValidCode(studentCode) && (
                <p className="text-xs text-red-600 text-center mt-2">
                  Formato inválido • Use solo letras mayúsculas y números
                </p>
              )}

              {studentCode.length === 8 && isValidCode(studentCode) && (
                <p className="text-xs text-green-600 text-center mt-2">
                  ✓ Código válido • Listo para verificar
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={studentCode.length !== 8 || !isValidCode(studentCode)}
              className={`w-full py-3 rounded-lg transition-all duration-300 font-medium shadow-lg text-lg ${
                studentCode.length === 8 && isValidCode(studentCode)
                  ? 'bg-[#042254] text-white hover:bg-[#031a42]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Verificar y Continuar
            </button>
          </form>
          
          {/* Footer con información de la PUCP */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Pontificia Universidad Católica del Perú • Calle Universitaria 1801, San Miguel, Lima
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}