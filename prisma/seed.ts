// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes (opcional, comentar si no se desea)
  // await prisma.answer.deleteMany();
  // await prisma.response.deleteMany();
  // await prisma.session.deleteMany();
  // await prisma.question.deleteMany();
  // await prisma.surveyTeacher.deleteMany();
  // await prisma.survey.deleteMany();
  // await prisma.teacher.deleteMany();
  // await prisma.student.deleteMany();
  // await prisma.admin.deleteMany();

  // Crear estudiantes (código de 8 caracteres)
  console.log('📚 Creando estudiantes...');
  const students = await Promise.all([
    prisma.student.create({
      data: {
        code: 'ALU20001',
        name: 'Juan Pérez',
        diplomatura: 'Diplomatura 1',
        email: 'juan.perez@example.com',
        status: 'active'
      }
    }),
    prisma.student.create({
      data: {
        code: 'ALU20002',
        name: 'María García',
        diplomatura: 'Diplomatura 2',
        email: 'maria.garcia@example.com',
        status: 'active'
      }
    }),
    prisma.student.create({
      data: {
        code: 'ALU20003',
        name: 'Carlos Rodríguez',
        diplomatura: 'Diplomatura 3',
        email: 'carlos.rodriguez@example.com',
        status: 'active'
      }
    }),
    prisma.student.create({
      data: {
        code: 'ALU20004',
        name: 'Ana Martínez',
        diplomatura: 'Diplomatura 4',
        email: 'ana.martinez@example.com',
        status: 'active'
      }
    }),
    prisma.student.create({
      data: {
        code: 'ALU20005',
        name: 'Luis Sánchez',
        diplomatura: 'Diplomatura 1',
        email: 'luis.sanchez@example.com',
        status: 'active'
      }
    }),
    prisma.student.create({
      data: {
        code: 'ALU20010',
        name: 'Pedro Gómez',
        diplomatura: 'Diplomatura 2',
        email: 'pedro.gomez@example.com',
        status: 'active'
      }
    })
  ]);
  console.log(`✅ ${students.length} estudiantes creados`);

  // Crear docentes
  console.log('👨‍🏫 Creando docentes...');
  const teachers = await Promise.all([
    // Diplomatura 1
    prisma.teacher.create({
      data: {
        name: 'VELIZ PALOMINO JOSE CARLOS',
        subject: 'Matemáticas Fundamentales',
        diplomatura: 'Diplomatura 1',
        photo: 'velizpalominojosecarlos.jpg',
        status: 'active'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'SANABRIA MONTANEZ CESAR AUGUSTO',
        subject: 'Comunicación Efectiva',
        diplomatura: 'Diplomatura 1',
        photo: 'sanabriamontanezcesaraugusto.jpeg',
        status: 'active'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'RODRIGUEZ REAÑO ROSA ELIZABETH',
        subject: 'Introducción a la Tecnología',
        diplomatura: 'Diplomatura 1',
        photo: 'rodriguezreanorosaelizabeth.jpeg',
        status: 'active'
      }
    }),
    // Diplomatura 2
    prisma.teacher.create({
      data: {
        name: 'PIÑA MORÁN MARCELO EUGENIO',
        subject: 'Estadística Aplicada',
        diplomatura: 'Diplomatura 2',
        photo: 'pinamoranmarceloeugenio.jpeg',
        status: 'active'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'MONTALVAN LUME JUAN GIUSEPE',
        subject: 'Gestión de Proyectos',
        diplomatura: 'Diplomatura 2',
        photo: 'montalvanlumejuangiusepe.jpeg',
        status: 'active'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'MENDOZA DE SOUZA WALTER WILFREDO',
        subject: 'Liderazgo Empresarial',
        diplomatura: 'Diplomatura 2',
        photo: 'mendozadesouzawalterwilfredo.jpeg',
        status: 'active'
      }
    }),
    // Diplomatura 3
    prisma.teacher.create({
      data: {
        name: 'MENACHO AGAMA JENNY LUZ',
        subject: 'Análisis de Datos',
        diplomatura: 'Diplomatura 3',
        photo: 'menachoagamajennyluz.jpeg',
        status: 'active'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'GUEVARA SALAS SUSANA ROSA GABRIELA',
        subject: 'Innovación Digital',
        diplomatura: 'Diplomatura 3',
        photo: 'guevarasalassusanarosagabriela.jpeg',
        status: 'active'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'CUENTAS RAMIREZ RAQUEL',
        subject: 'Seguridad Informática',
        diplomatura: 'Diplomatura 3',
        photo: 'cuentasramirezraquel.jpeg',
        status: 'active'
      }
    }),
    // Diplomatura 4
    prisma.teacher.create({
      data: {
        name: 'CASTAÑEDA CASTAÑEDA CESAR EDUARDO',
        subject: 'Proyecto de Graduación',
        diplomatura: 'Diplomatura 4',
        photo: 'castanedacastanedacesareduardo.jpeg',
        status: 'active'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'BARDALES HOYOS ALEJANDRO MARIO',
        subject: 'Ética Profesional',
        diplomatura: 'Diplomatura 4',
        photo: 'bardaleshoyosalejandromario.jpeg',
        status: 'active'
      }
    }),
    prisma.teacher.create({
      data: {
        name: 'SUSANA GABRIELA GUEVARA SALAS',
        subject: 'Presentación de Proyectos',
        diplomatura: 'Diplomatura 4',
        photo: 'guevarasalassusanarosagabriela.jpeg',
        status: 'active'
      }
    })
  ]);
  console.log(`✅ ${teachers.length} docentes creados`);

  // Crear administrador
  console.log('🔐 Creando administrador...');
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@pucp.edu.pe',
      password: 'admin123', // En producción, usar hash
      name: 'Administrador Principal'
    }
  });
  console.log('✅ Administrador creado');

  console.log('✨ Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
