
import ProgressIndicator from '../ui/ProgressIndicator';
import BackButton from '../ui/BackButton';
import RatingSlider from '../ui/RatingSlider';

export default function SurveyForm({ 
  teacher, 
  diplomatura, 
  onBack, 
  onSubmit,
  dominioRating,
  claridadRating,
  setDominioRating,
  setClaridadRating
}) {
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
              e.target.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'text-2xl font-bold text-white mb-2';
              fallback.textContent = 'PUCP';
              e.target.parentNode.appendChild(fallback);
            }}
          />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto p-6 mt-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <ProgressIndicator currentStep={3} />
          
          <BackButton onClick={onBack} />
          
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <img 
                src={`/teachers/${teacher.photo}`} 
                alt="Docente" 
                className="w-20 h-20 rounded-full border-4 border-[#042254] object-cover"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/100x100/042254/white?text=DOC';
                }}
              />
            </div>
            <h1 className="text-2xl font-bold text-[#042254] mb-2">
              Evaluación para {teacher.name}
            </h1>
            <p className="text-gray-600">
              Encuesta de satisfacción - {diplomatura}
            </p>
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block mt-2">
              ID: EVAL-{teacher.diplomaturaKey.toUpperCase()}-{teacher.id}-001
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Pregunta 1: Dominio del tema - SLIDER */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <RatingSlider
                value={dominioRating}
                onChange={setDominioRating}
                max={5}
                question="¿Cómo calificaría el dominio del tema por parte del docente?"
              />
            </div>

            {/* Pregunta 2: Claridad en explicaciones - SLIDER */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <RatingSlider
                value={claridadRating}
                onChange={setClaridadRating}
                max={5}
                question="¿El docente explica los conceptos de manera clara y comprensible?"
              />
            </div>

            {/* Pregunta 3: Aspectos positivos */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">
                ¿Qué aspectos positivos destacaría del docente? (Seleccione todos los que apliquen)
              </h3>
              <div className="space-y-2">
                {['Puntualidad', 'Disponibilidad para resolver dudas', 'Material didáctico de calidad', 'Evaluaciones justas', 'Ambiente de aprendizaje positivo']
                  .map((option, index) => (
                    <label key={index} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 text-purple-600 focus:ring-purple-500"
                      />
                      {option}
                    </label>
                  ))
                }
              </div>
            </div>

            {/* Pregunta 4: Sugerencias */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">
                ¿Tiene alguna sugerencia para mejorar la enseñanza del docente?
              </h3>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#042254] focus:border-transparent"
                rows="3" 
                placeholder="Escriba sus sugerencias constructivas..."
              ></textarea>
            </div>

            <div className="flex gap-3">
              <button 
                type="button"
                onClick={onBack}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Atrás
              </button>
              <button 
                type="submit" 
                className="flex-1 bg-[#042254] text-white py-3 rounded-lg hover:bg-[#031a42] transition-all duration-300 font-medium shadow-lg"
              >
                Enviar Evaluación
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}