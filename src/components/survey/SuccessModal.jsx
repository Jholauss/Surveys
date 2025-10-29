
import { Check } from 'lucide-react';

export default function SuccessModal({ show, onClose }) {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-3">¡Evaluación Enviada!</h2>
        <p className="text-gray-600 mb-6">
          Gracias por tu tiempo. Tu opinión es muy importante para mejorar la calidad educativa.
        </p>
        <p className="text-sm text-gray-500">
          Redirigiendo al inicio...
        </p>
      </div>
    </div>
  );
}