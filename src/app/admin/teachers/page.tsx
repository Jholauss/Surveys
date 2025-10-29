"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";
import { diplomaturaTeachers } from "@/lib/data";

interface Teacher {
  id: string;
  name: string;
  subject: string;
  photo: string;
  diplomatura: string;
}

export default function TeachersPage() {
  const initialTeachers: Teacher[] = Object.entries(diplomaturaTeachers).flatMap(
    ([diplomaturaKey, teachers]) =>
      teachers.map((t) => ({
        ...t,
        diplomatura: diplomaturaKey,
      }))
  );

  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [formData, setFormData] = useState<Omit<Teacher, "id">>({
    name: "",
    subject: "",
    photo: "",
    diplomatura: "diploma1",
  });

  // 🔹 Filtrar docentes solo por ID
  const filteredTeachers = teachers.filter((teacher) =>
    teacher.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingTeacher(null);
    setFormData({
      name: "",
      subject: "",
      photo: "",
      diplomatura: "diploma1",
    });
    setPreviewUrl("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      subject: teacher.subject,
      photo: teacher.photo,
      diplomatura: teacher.diplomatura,
    });
    setPreviewUrl(teacher.photo);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        setFormData({ ...formData, photo: result.url });
      } else {
        alert(result.error || "Error al subir la imagen");
      }
    } catch (error) {
      console.error(error);
      alert("Error de red al subir la imagen");
    }
  };

  const handleSave = () => {
  if (!formData.name || !formData.subject) {
    alert("Por favor complete los campos obligatorios");
    return;
  }

  if (editingTeacher) {
    setTeachers((prev) =>
      prev.map((t) =>
        t.id === editingTeacher.id ? { ...editingTeacher, ...formData, id: formData.subject } : t
      )
    );
  } else {
    const newTeacher: Teacher = {
      id: formData.subject, // <-- Ahora el ID será el código PUCP
      ...formData,
      photo: formData.photo || "default.jpg",
    };
    setTeachers((prev) => [...prev, newTeacher]);
  }

  setIsModalOpen(false);
  setEditingTeacher(null);
};


  const handleDelete = (teacherId: string) => {
    if (confirm("¿Está seguro de eliminar este docente?")) {
      setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
    }
  };

  const getDiplomaturaName = (key: string): string => {
    const names: Record<string, string> = {
      diploma1: "Diplomatura 1",
      diploma2: "Diplomatura 2",
      diploma3: "Diplomatura 3",
      diploma4: "Diplomatura 4",
    };
    return names[key] || key;
  };

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
          onClick={handleOpenCreate}
          className="bg-[#042254] hover:bg-[#031a42]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Docente
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por ID del docente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Foto</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                  {/* <th className="text-left py-3 px-4 font-semibold text-gray-700">Asignatura</th> */}
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Diplomatura</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No hay docentes con ese código
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <tr
                      key={teacher.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-mono text-gray-700">{teacher.id}</td>
                      <td className="py-3 px-4">
                        <img
                          src={
                            teacher.photo?.startsWith("/teachers/")
                              ? teacher.photo
                              : `/teachers/${teacher.photo}`
                          }
                          alt={teacher.name}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/40x40/042254/white?text=DOC";
                          }}
                        />
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">{teacher.name}</td>
                      {/* <td className="py-3 px-4 text-gray-600">{teacher.subject}</td> */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {getDiplomaturaName(teacher.diplomatura)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(teacher)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{editingTeacher ? "Editar Docente" : "Nuevo Docente"}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              
              <div>
                <Label htmlFor="subject">Código PUCP *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Código PUCP"
                  required
                />
              </div>
              <div>
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nombre y Apellidos"
                  required
                />
              </div>
              <div>
                <Label htmlFor="photoFile">Foto del Docente</Label>
                <Input
                  id="photoFile"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                />

                {(previewUrl || formData.photo) && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={
                        previewUrl ||
                        (formData.photo
                          ? formData.photo.startsWith("/teachers/")
                            ? formData.photo
                            : `/teachers/${formData.photo}`
                          : "/teachers/default.jpg")
                      }
                      alt="Vista previa"
                      className="w-20 h-20 rounded-full object-cover border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/80x80/042254/white?text=DOC";
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPreviewUrl("");
                        setFormData({ ...formData, photo: "" });
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Quitar
                    </Button>
                  </div>
                )}
              </div>

              {/* <div>
                <Label htmlFor="diplomatura">Diplomatura *</Label>
                <Select
                  value={formData.diplomatura}
                  onValueChange={(value) =>
                    setFormData({ ...formData, diplomatura: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione diplomatura" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diploma1">Diplomatura 1</SelectItem>
                    <SelectItem value="diploma2">Diplomatura 2</SelectItem>
                    <SelectItem value="diploma3">Diplomatura 3</SelectItem>
                    <SelectItem value="diploma4">Diplomatura 4</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  className="bg-[#042254] hover:bg-[#031a42]"
                >
                  {editingTeacher ? "Guardar Cambios" : "Crear Docente"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
