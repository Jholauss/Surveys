// scripts/import-data.ts
/**
 * Script de integración para cargar docentes y encuestas desde archivos JSON
 *
 * Uso:
 *   npx tsx scripts/import-data.ts --teachers teachers.json
 *   npx tsx scripts/import-data.ts --surveys surveys.json
 *   npx tsx scripts/import-data.ts --teachers teachers.json --surveys surveys.json
 */

import { readFile } from 'fs/promises';
import { join } from 'path';

interface TeacherData {
  name: string;
  email?: string;
  subject?: string;
  diplomatura?: string;
  photo?: string;
  photoBase64?: string;
  status?: string;
}

interface SurveyData {
  title: string;
  description?: string;
  type: string;
  status?: string;
  startsAt?: string;
  endsAt?: string;
  requiresCode?: boolean;
  allowAnonymous?: boolean;
  questions: any[];
  teacherIds?: string[];
  teacherNames?: string[];
}

// Configuración
const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

let adminCookie: string | null = null;

async function login(): Promise<void> {
  console.log('🔐 Iniciando sesión como admin...');

  const response = await fetch(`${API_URL}/api/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
  });

  if (!response.ok) {
    throw new Error(`Error en login: ${response.statusText}`);
  }

  // Obtener cookie de sesión
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) {
    adminCookie = setCookie.split(';')[0];
  }

  console.log('✅ Sesión iniciada correctamente\n');
}

async function importTeachers(filePath: string): Promise<void> {
  console.log(`📚 Importando docentes desde ${filePath}...`);

  const fileContent = await readFile(filePath, 'utf-8');
  const teachers: TeacherData[] = JSON.parse(fileContent);

  console.log(`Encontrados ${teachers.length} docentes\n`);

  const response = await fetch(`${API_URL}/api/admin/teachers/bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': adminCookie || ''
    },
    body: JSON.stringify({ teachers })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Error importando docentes: ${JSON.stringify(error)}`);
  }

  const result = await response.json();

  console.log('📊 Resultado de importación de docentes:');
  console.log(`   Total: ${result.summary.total}`);
  console.log(`   ✅ Creados: ${result.summary.created}`);
  console.log(`   ❌ Errores: ${result.summary.errors}`);

  if (result.results.created.length > 0) {
    console.log('\n✅ Docentes creados:');
    result.results.created.forEach((t: any) => {
      console.log(`   - ${t.name} (ID: ${t.id})${t.photo ? ' [con foto]' : ''}`);
    });
  }

  if (result.results.errors.length > 0) {
    console.log('\n❌ Errores:');
    result.results.errors.forEach((e: any) => {
      console.log(`   - ${e.teacher}: ${e.error}`);
    });
  }

  console.log();
}

async function importSurveys(filePath: string): Promise<void> {
  console.log(`📋 Importando encuestas desde ${filePath}...`);

  const fileContent = await readFile(filePath, 'utf-8');
  const surveys: SurveyData[] = JSON.parse(fileContent);

  console.log(`Encontradas ${surveys.length} encuestas\n`);

  const response = await fetch(`${API_URL}/api/admin/surveys/bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': adminCookie || ''
    },
    body: JSON.stringify({ surveys })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Error importando encuestas: ${JSON.stringify(error)}`);
  }

  const result = await response.json();

  console.log('📊 Resultado de importación de encuestas:');
  console.log(`   Total: ${result.summary.total}`);
  console.log(`   ✅ Creadas: ${result.summary.created}`);
  console.log(`   ❌ Errores: ${result.summary.errors}`);

  if (result.results.created.length > 0) {
    console.log('\n✅ Encuestas creadas:');
    result.results.created.forEach((s: any) => {
      console.log(`   - ${s.title}`);
      console.log(`     Link: ${s.publicLink}`);
      console.log(`     Preguntas: ${s.questionsCount}, Docentes: ${s.teachersCount}`);
    });
  }

  if (result.results.errors.length > 0) {
    console.log('\n❌ Errores:');
    result.results.errors.forEach((e: any) => {
      console.log(`   - ${e.survey}: ${e.error}`);
    });
  }

  console.log();
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Uso: npx tsx scripts/import-data.ts [opciones]

Opciones:
  --teachers <archivo>  Importar docentes desde archivo JSON
  --surveys <archivo>   Importar encuestas desde archivo JSON

Ejemplos:
  npx tsx scripts/import-data.ts --teachers data/teachers.json
  npx tsx scripts/import-data.ts --surveys data/surveys.json
  npx tsx scripts/import-data.ts --teachers data/teachers.json --surveys data/surveys.json
    `);
    process.exit(0);
  }

  try {
    await login();

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--teachers' && args[i + 1]) {
        await importTeachers(args[i + 1]);
        i++;
      } else if (args[i] === '--surveys' && args[i + 1]) {
        await importSurveys(args[i + 1]);
        i++;
      }
    }

    console.log('✨ Importación completada exitosamente');

  } catch (error) {
    console.error('❌ Error en la importación:', error);
    process.exit(1);
  }
}

main();
