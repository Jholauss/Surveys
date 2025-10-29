
export default function SurveyLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
}