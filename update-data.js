// scripts/update-data.js
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "src", "lib", "data.js");
const teachersDir = path.join(process.cwd(), "public", "teachers");

// Leer data.js
let dataContent = fs.readFileSync(dataPath, "utf8");

// Leer nombres reales de los archivos
const fileNames = fs.readdirSync(teachersDir);

// Para cada archivo, buscar coincidencias parciales y reemplazar
fileNames.forEach((file) => {
  const base = file.split(".")[0];
  const regex = new RegExp(`photo:\\s*['"\`].*${base}.*['"\`]`, "gi");
  dataContent = dataContent.replace(regex, `photo: '${file}'`);
});

fs.writeFileSync(dataPath, dataContent);
console.log("✅ data.js actualizado con los nombres correctos de fotos.");
