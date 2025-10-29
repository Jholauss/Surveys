"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  email?: string;
  subject?: string;
  diplomatura?: string;
  photo?: string;
  status: string;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/teachers");
      const data = await res.json();

      if (res.ok) {
        setTeachers(data.teachers || []);
      } else {
        setError(data.error || "Error al cargar docentes");
        console.error("Error en respuesta:", data);
      }
    } catch (error) {
      console.error("Error cargando docentes:", error);
      setError("Error de conexión al cargar docentes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (teacherId: string) => {
    if (!confirm("¿Está seguro de eliminar este docente?")) return;

    try {
      const res = await fetch(`/api/admin/teachers/${teacherId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
      } else {
        alert("Error al eliminar docente");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de red");
    }
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-12">Cargando docentes...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadTeachers}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Docentes
          </h1>
          <p className="text-gray-600">
            Administre la información de los docentes
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#042254] hover:bg-[#031a42]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Docente
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla de docentes */}
      <Card>
        <CardHeader>
          <CardTitle>Docentes ({filteredTeachers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Foto
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Nombre
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Materia
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Diplomatura
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Estado
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No hay docentes registrados. Haga clic en "Nuevo Docente" para agregar uno.
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <tr
                      key={teacher.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                          {teacher.photo ? (
                            <img
                              src={teacher.photo}
                              alt={teacher.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-lg text-gray-400">👤</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {teacher.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {teacher.email || "-"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {teacher.subject || "-"}
                      </td>
                      <td className="py-3 px-4">
                        {teacher.diplomatura ? (
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {teacher.diplomatura}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            teacher.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {teacher.status === "active" ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              alert("Funcionalidad de editar próximamente")
                            }
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(teacher.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Crear Docente */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <CreateTeacherModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              loadTeachers();
            }}
          />
        </div>
      )}
    </div>
  );
}

// Modal Component
function CreateTeacherModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    diplomatura: '',
    status: 'active'
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let photoUrl = undefined;

      // Si hay foto, subirla primero
      if (photo) {
        const photoFormData = new FormData();
        photoFormData.append('photo', photo);

        const photoRes = await fetch('/api/admin/teachers/upload-photo', {
          method: 'POST',
          body: photoFormData
        });

        if (photoRes.ok) {
          const photoData = await photoRes.json();
          photoUrl = photoData.photoUrl;
        } else {
          throw new Error('Error al subir la foto');
        }
      }

      // Crear el docente
      const res = await fetch('/api/admin/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          photo: photoUrl
        })
      });

      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Error al crear docente');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Nuevo Docente</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="name">Nombre completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Dr. Juan Pérez"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="juan.perez@university.edu"
            />
          </div>

          <div>
            <Label htmlFor="subject">Materia</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Matemáticas Avanzadas"
            />
          </div>

          <div>
            <Label htmlFor="diplomatura">Diplomatura</Label>
            <Input
              id="diplomatura"
              value={formData.diplomatura}
              onChange={(e) => setFormData({ ...formData, diplomatura: e.target.value })}
              placeholder="Ingeniería de Sistemas"
            />
          </div>

          <div>
            <Label htmlFor="photo">Foto del docente</Label>
            <Input
              id="photo"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handlePhotoChange}
            />
            {photoPreview && (
              <div className="mt-2">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Máximo 5MB. Formatos: JPEG, PNG, WebP
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={formData.status === 'active'}
              onChange={(e) => setFormData({
                ...formData,
                status: e.target.checked ? 'active' : 'inactive'
              })}
            />
            <Label htmlFor="active">Activo</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Docente'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
