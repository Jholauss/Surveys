
export default function RatingSlider({ value, onChange, max = 5, question }) {
  const getRatingLabel = (rating) => {
    const labels = ['Deficiente', 'Regular', 'Bueno', 'Muy Bueno', 'Excelente'];
    return labels[rating - 1] || '';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-800">{question}</h3>
        <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
          {value}/5
        </span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min="1"
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        
        {/* Marcadores del slider */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {[1, 2, 3, 4, 5].map((num) => (
            <span key={num}>{num}</span>
          ))}
        </div>
      </div>
      
      {/* Etiqueta descriptiva */}
      <div className="text-center">
        <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
          {getRatingLabel(value)}
        </span>
      </div>
    </div>
  );
}