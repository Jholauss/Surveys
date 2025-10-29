
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ onClick }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
    >
      <ArrowLeft size={20} />
      Volver
    </button>
  );
}