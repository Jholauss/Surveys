// scripts/image-to-base64.ts
/**
 * Utilidad para convertir imágenes a base64
 * Útil para preparar datos de docentes con fotos
 *
 * Uso:
 *   npx tsx scripts/image-to-base64.ts foto.jpg
 *   npx tsx scripts/image-to-base64.ts --folder fotos-docentes/
 */

import { readFile, readdir } from 'fs/promises';
import { join, extname, basename } from 'path';

async function imageToBase64(filePath: string): Promise<string> {
  const buffer = await readFile(filePath);
  const base64 = buffer.toString('base64');

  // Detectar tipo de imagen por extensión
  const ext = extname(filePath).toLowerCase();
  let mimeType = 'image/jpeg';

  if (ext === '.png') mimeType = 'image/png';
  else if (ext === '.webp') mimeType = 'image/webp';
  else if (ext === '.gif') mimeType = 'image/gif';

  return `data:${mimeType};base64,${base64}`;
}

async function processFolder(folderPath: string): Promise<void> {
  const files = await readdir(folderPath);

  const imageFiles = files.filter(f => {
    const ext = extname(f).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
  });

  console.log(`\n📸 Encontradas ${imageFiles.length} imágenes en ${folderPath}\n`);

  for (const file of imageFiles) {
    const filePath = join(folderPath, file);
    const base64 = await imageToBase64(filePath);
    const size = Buffer.from(base64.split(',')[1], 'base64').length;
    const sizeMB = (size / (1024 * 1024)).toFixed(2);

    console.log(`✅ ${file}`);
    console.log(`   Tamaño: ${sizeMB}MB`);
    console.log(`   Base64 (primeros 100 chars): ${base64.substring(0, 100)}...`);
    console.log();
  }
}

async function processSingleFile(filePath: string): Promise<void> {
  console.log(`\n📸 Procesando ${filePath}...\n`);

  const base64 = await imageToBase64(filePath);
  const size = Buffer.from(base64.split(',')[1], 'base64').length;
  const sizeMB = (size / (1024 * 1024)).toFixed(2);

  console.log(`✅ Imagen convertida a base64`);
  console.log(`   Tamaño: ${sizeMB}MB`);
  console.log(`\nBase64 completo:\n`);
  console.log(base64);
  console.log();

  // Ejemplo de uso en JSON
  console.log(`\nEjemplo de uso en teachers.json:\n`);
  console.log(JSON.stringify({
    name: "Nombre del Docente",
    email: "email@example.com",
    subject: "Materia",
    diplomatura: "Diplomatura",
    photoBase64: base64,
    status: "active"
  }, null, 2));
  console.log();
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Uso: npx tsx scripts/image-to-base64.ts [archivo o carpeta]

Ejemplos:
  npx tsx scripts/image-to-base64.ts foto.jpg
  npx tsx scripts/image-to-base64.ts --folder fotos-docentes/

Genera base64 de imágenes para usar en la carga masiva de docentes.
    `);
    process.exit(0);
  }

  try {
    if (args[0] === '--folder' && args[1]) {
      await processFolder(args[1]);
    } else {
      await processSingleFile(args[0]);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
