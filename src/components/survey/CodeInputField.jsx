import { useRef } from 'react';

export default function CodeInputField({ value, onChange, length = 10 }) {
  const codeContainerRef = useRef(null);

  // Función para manejar el cambio en cada caja del código
  const handleCodeChange = (index, newValue) => {
    // Solo permitir letras mayúsculas y números
    if (newValue && !/^[A-Z0-9]$/.test(newValue)) {
      return;
    }
    
    const newCode = value.split('');
    while (newCode.length < length) newCode.push('');
    newCode[index] = newValue || '';
    
    const finalCode = newCode.join('').substring(0, length);
    onChange(finalCode);
    
    // Enfocar siguiente input
    if (newValue && index < length - 1) {
      setTimeout(() => {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }, 10);
    }
  };

  // Función para manejar la tecla Enter y Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      setTimeout(() => {
        const prevInput = document.getElementById(`code-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
          const newCode = value.split('');
          newCode[index - 1] = '';
          onChange(newCode.join(''));
        }
      }, 10);
    }
    // Prevenir caracteres especiales
    if (e.key && !/^[A-Z0-9]$/.test(e.key) && e.key.length === 1) {
      e.preventDefault();
    }
  };

  // Función para pegar
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').toUpperCase();
    // Solo permitir letras mayúsculas y números
    const cleanedData = pastedData.replace(/[^A-Z0-9]/g, '').substring(0, length);
    
    if (cleanedData) {
      onChange(cleanedData);
      const lastCharIndex = Math.min(cleanedData.length - 1, length - 1);
      setTimeout(() => {
        const lastInput = document.getElementById(`code-${lastCharIndex}`);
        if (lastInput) lastInput.focus();
      }, 10);
    }
  };

  // Función para enfocar el primer input al hacer clic en el contenedor
  const handleContainerClick = () => {
    if (codeContainerRef.current) {
      const firstInput = codeContainerRef.current.querySelector('input');
      if (firstInput) {
        firstInput.focus();
      }
    }
  };

  // Crear array con los caracteres actuales
  const codeArray = value.split('');
  while (codeArray.length < length) codeArray.push('');

  return (
    <div className="flex justify-center gap-2">
      {codeArray.map((char, index) => (
        <input
          key={index}
          id={`code-${index}`}
          type="text"
          value={char}
          onChange={(e) => handleCodeChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          maxLength="1"
          className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#042254] focus:ring-2 focus:ring-[#042254]"
          // Prevenir entrada de caracteres especiales
          onKeyPress={(e) => {
            if (!/^[A-Z0-9]$/.test(e.key)) {
              e.preventDefault();
            }
          }}
        />
      ))}
    </div>
  );
}