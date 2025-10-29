
import { Check } from 'lucide-react';

export default function ProgressIndicator({ currentStep }) {
  // Mantenemos 3 pasos para consistencia
  const steps = [
    { number: 1, title: 'Código', completed: currentStep > 1 },
    { number: 2, title: 'Docentes', completed: currentStep > 2 },
    { number: 3, title: 'Evaluación', completed: currentStep > 3 }
  ];

  return (
    <div className="flex items-center justify-center mb-6">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
              step.completed 
                ? 'bg-blue-600' 
                : currentStep === step.number
                  ? 'bg-blue-600'
                  : 'bg-gray-300'
            }`}
          >
            {step.completed ? <Check size={16} /> : step.number}
          </div>
          <span className={`ml-2 text-sm font-medium ${
            step.completed || currentStep >= step.number
              ? 'text-blue-600'
              : 'text-gray-400'
          }`}>
            {step.title}
          </span>
          {index < steps.length - 1 && (
            <div className={`h-0.5 w-8 ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          )}
        </div>
      ))}
    </div>
  );
}