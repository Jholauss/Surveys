# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sistema de creación y gestión de encuestas dinámicas desarrollado con Next.js 15, MySQL y Prisma. Permite a administradores crear encuestas personalizadas con preguntas dinámicas y generar links únicos para que usuarios las completen. Incluye soporte para evaluación de docentes, encuestas institucionales y más.

## Development Commands

- `npm run dev` - Inicia el servidor de desarrollo en http://localhost:3000
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run db:seed` - Ejecuta el seed de la base de datos con datos iniciales
- `npm run db:migrate` - Crea y aplica migraciones de Prisma
- `npm run db:studio` - Abre Prisma Studio para administrar la BD visualmente

## Database Setup

El proyecto usa MySQL en Docker. Para levantar la base de datos:

```bash
docker run --name surveys -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=surveys -p 3307:3306 -d mysql:8.0
```

Luego ejecutar migraciones y seed:

```bash
npm run db:migrate
npm run db:seed
```

La conexión está configurada en `.env`:
```
DATABASE_URL="mysql://root:root@localhost:3307/surveys"
```

## Architecture

### Structure

- `src/app/` - Next.js App Router pages y API routes
  - `survey/[uniqueLink]/` - Vista pública de encuestas (ruta dinámica)
  - `admin/` - Panel de administración protegido
  - `api/survey/` - API routes públicas para encuestas
  - `api/admin/` - API routes protegidas para administración
- `src/components/` - Componentes React organizados por funcionalidad
  - `survey/` - Componentes del flujo de evaluación (reutilizables)
  - `admin/` - Componentes del panel administrativo
  - `ui/` - Componentes reutilizables (Shadcn/UI y custom)
- `src/lib/` - Lógica de negocio y utilidades
  - `prisma.ts` - Cliente singleton de Prisma
  - `admin/auth.ts` - Sistema de autenticación
- `prisma/` - Schema y migraciones de Prisma
  - `schema.prisma` - Definición de modelos de BD
  - `seed.ts` - Datos iniciales
  - `migrations/` - Historial de migraciones
- `middleware.ts` - Protección de rutas administrativas

### Database Models

**Core Models:**
- `Survey` - Encuestas creadas por admin (con uniqueLink para acceso público)
- `Question` - Preguntas dinámicas de cada encuesta (tipo: text, rating, multiple_choice, checkbox)
- `Teacher` - Docentes que pueden ser evaluados
- `Student` - Estudiantes que responden encuestas (código de 8 caracteres)
- `Session` - Sesiones de usuarios respondiendo encuestas
- `Response` - Respuestas completas a encuestas
- `Answer` - Respuestas individuales a cada pregunta
- `SurveyTeacher` - Relación many-to-many entre encuestas y docentes
- `Admin` - Usuarios administradores del sistema

### Key Concepts

**Flujo de Creación de Encuestas (Admin):**
1. Admin crea encuesta con título, descripción, tipo y preguntas dinámicas
2. Sistema genera `uniqueLink` único (usando nanoid)
3. Admin asocia docentes a la encuesta (opcional, según tipo)
4. Admin activa la encuesta (status: draft → active)
5. Sistema devuelve link público: `/survey/{uniqueLink}`

**Flujo de Respuesta a Encuestas (Público):**
1. Usuario accede a `/survey/{uniqueLink}`
2. Sistema valida encuesta (activa, dentro de fechas, etc.)
3. Si `requiresCode=true`: Usuario ingresa código de 8 caracteres
4. Sistema valida estudiante en BD y crea sesión con token único
5. Sesión persiste en URL: `?token={sessionToken}`
6. Usuario responde preguntas dinámicas de la encuesta
7. Si hay múltiples docentes: evalúa uno por uno
8. Al completar todo, sesión se marca como `completed=true`

**Sistema de Autenticación Admin:**
- Middleware protege todas las rutas `/admin/*`
- Cookie `admin_session` con validación en cada API route
- Emails autorizados en `ADMIN_EMAILS` en `src/lib/admin/auth.ts`
- Password configurable vía `ADMIN_PASSWORD` env var (default: admin123)
- Logout limpia cookie y redirige a login

**Preguntas Dinámicas:**
- Tipos soportados: text, textarea, rating, multiple_choice, checkbox
- Cada pregunta tiene `order`, `required`, `minValue/maxValue` (para ratings)
- Opciones almacenadas como JSON para multiple_choice/checkbox
- Respuestas almacenadas como JSON en tabla `Answer`

**Links Únicos:**
- Generados con nanoid (10 caracteres)
- Formato: `/survey/abc123xyz0`
- Indexados en BD para búsqueda rápida
- Públicos y compartibles

### Path Aliases

- `@/*` mapea a `src/*` (configurado en tsconfig.json)

### Tech Stack Notes

- Next.js 15 con App Router
- React 18.2 (client components predominan por interactividad)
- TypeScript + JavaScript híbrido (.ts, .tsx, .js, .jsx coexisten)
- MySQL 8.0 corriendo en Docker (puerto 3307)
- Prisma ORM para gestión de base de datos
- Tailwind CSS + Shadcn/UI components
- React Hook Form + Zod para validación
- nanoid para generación de IDs únicos

### Important Files

- `prisma/schema.prisma` - Schema completo de la base de datos
- `src/lib/prisma.ts` - Cliente singleton de Prisma (usar SIEMPRE este export)
- `middleware.ts` - Control de acceso a rutas admin
- `src/lib/admin/auth.ts` - Lógica de autenticación (agregar emails admin aquí)
- `src/app/api/survey/` - APIs públicas para flujo de encuestas
- `src/app/api/admin/surveys/route.ts` - API para crear/listar encuestas
- `src/app/survey/[uniqueLink]/page.tsx` - Vista pública de encuestas

### Important Notes

- Estudiantes tienen código de **8 caracteres** (no 10)
- Links de encuestas son **públicos** pero pueden requerir código de estudiante
- Sesiones expiran en 24 horas por defecto
- Las respuestas se almacenan como JSON para flexibilidad
- Cada evaluación de docente es una Response separada en la misma Session
