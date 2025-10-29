
import { Check, AlertTriangle } from 'lucide-react';

export default function Notification({ show, message, type }) {
  if (!show) return null;
  
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
      type === 'success' 
        ? 'bg-green-50 text-green-800 border-l-4 border-green-500' 
        : 'bg-red-50 text-red-800 border-l-4 border-red-500'
    }`}>
      <div className="flex items-start">
        {type === 'success' ? (
          <Check size={20} className="mt-0.5 mr-2 text-green-500" />
        ) : (
          <AlertTriangle size={20} className="mt-0.5 mr-2 text-red-500" />
        )}
        <p>{message}</p>
      </div>
    </div>
  );
}