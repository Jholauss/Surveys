// src/components/admin/teachers/BulkUploadTeachers.tsx
'use client';

import { useState } from 'react';

interface TeacherUploadData {
  name: string;
  email: string;
  subject: string;
  diplomatura: string;
  photo?: File;
  status: string;
}

export default function BulkUploadTeachers() {
  const [teachers, setTeachers] = useState<TeacherUploadData[]>([{
    name: '',
    email: '',
    subject: '',
    diplomatura: '',
    status: 'active'
  }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const addTeacher = () => {
    setTeachers([...teachers, {
      name: '',
      email: '',
      subject: '',
      diplomatura: '',
      status: 'active'
    }]);
  };

  const updateTeacher = (index: number, field: string, value: any) => {
    const updated = [...teachers];
    (updated[index] as any)[field] = value;
    setTeachers(updated);
  };

  const handlePhotoChange = (index: number, file: File | null) => {
    if (file) {
      updateTeacher(index, 'photo', file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Convertir fotos a base64
      const teachersWithPhotos = await Promise.all(
        teachers.map(async (teacher) => {
          let photoBase64 = undefined;

          if (teacher.photo) {
            photoBase64 = await fileToBase64(teacher.photo);
          }

          return {
            name: teacher.name,
            email: teacher.email || undefined,
            subject: teacher.subject || undefined,
            diplomatura: teacher.diplomatura || undefined,
            photoBase64,
            status: teacher.status
          };
        })
      );

      // Enviar a la API
      const response = await fetch('/api/admin/teachers/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ teachers: teachersWithPhotos })
      });

      if (!response.ok) {
        throw new Error('Error al crear docentes');
      }

      const data = await response.json();
      setResult(data);

      // Limpiar formulario si todo salió bien
      if (data.summary.errors === 0) {
        setTeachers([{
          name: '',
          email: '',
          subject: '',
          diplomatura: '',
          status: 'active'
        }]);
      }

    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear docentes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Carga Masiva de Docentes</h2>

      <form onSubmit={handleSubmit}>
        {teachers.map((teacher, index) => (
          <div key={index} className="mb-6 p-4 border rounded-lg">
            <h3 className="font-semibold mb-3">Docente #{index + 1}</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={teacher.name}
                  onChange={(e) => updateTeacher(index, 'name', e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Dr. Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={teacher.email}
                  onChange={(e) => updateTeacher(index, 'email', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="juan.perez@university.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Materia
                </label>
                <input
                  type="text"
                  value={teacher.subject}
                  onChange={(e) => updateTeacher(index, 'subject', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Matemáticas Avanzadas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Diplomatura
                </label>
                <input
                  type="text"
                  value={teacher.diplomatura}
                  onChange={(e) => updateTeacher(index, 'diplomatura', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Ingeniería de Sistemas"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Foto del docente (opcional)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => handlePhotoChange(index, e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Máximo 5MB. Formatos: JPEG, PNG, WebP
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={addTeacher}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            + Agregar otro docente
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Creando...' : `Crear ${teachers.length} docente(s)`}
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Resultado</h3>
          <p className="text-sm">
            Total: {result.summary.total} |
            Creados: {result.summary.created} |
            Errores: {result.summary.errors}
          </p>

          {result.results.created.length > 0 && (
            <div className="mt-3">
              <p className="font-medium text-sm mb-1">Docentes creados:</p>
              <ul className="text-sm space-y-1">
                {result.results.created.map((t: any, i: number) => (
                  <li key={i}>
                    ✅ {t.name} {t.photo && '(con foto)'}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.results.errors.length > 0 && (
            <div className="mt-3">
              <p className="font-medium text-sm mb-1 text-red-600">Errores:</p>
              <ul className="text-sm space-y-1 text-red-600">
                {result.results.errors.map((e: any, i: number) => (
                  <li key={i}>
                    ❌ {e.teacher}: {e.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
