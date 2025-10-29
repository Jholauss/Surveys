// scripts/rename-teachers.js
import fs from "fs";
import path from "path";

// Ruta de tu carpeta de imágenes
const teachersDir = path.join(process.cwd(), "public", "teachers");

// Función para limpiar nombres de archivo
function cleanFileName(name) {
  return name
    .normalize("NFD") // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // elimina tildes
    .replace(/[^a-zA-Z0-9. ]/g, "") // elimina caracteres raros
    .replace(/\s+/g, "_") // reemplaza espacios por _
    .toLowerCase(); // todo en minúsculas
}

// Renombrar archivos
fs.readdirSync(teachersDir).forEach((file) => {
  const oldPath = path.join(teachersDir, file);
  const newFileName = cleanFileName(file);
  const newPath = path.join(teachersDir, newFileName);

  if (oldPath !== newPath) {
    fs.renameSync(oldPath, newPath);
    console.log(`✅ ${file} → ${newFileName}`);
  }
});

console.log("🚀 Todos los nombres fueron normalizados correctamente.");
