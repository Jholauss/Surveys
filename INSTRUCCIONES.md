# Sistema de Encuestas Dinámicas - Instrucciones de Uso

## 🚀 Inicio Rápido

### 1. Levantar la Base de Datos

MySQL ya está corriendo en Docker (puerto 3307). Si necesitas reiniciarlo:

```bash
docker start surveys
```

### 2. Instalar Dependencias y Configurar BD

```bash
npm install
npm run db:migrate  # Aplicar migraciones
npm run db:seed     # Poblar con datos iniciales
```

### 3. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

Accede a: **http://localhost:3000**

---

## 📁 Estructura del Proyecto

### Landing Page (/)
- **Acceso Administrador**: Crea encuestas y gestiona el sistema
- **Información para Estudiantes**: Explica cómo acceder a encuestas

### Panel Administrativo (/admin)

#### Login
- Email: `admin@pucp.edu.pe`
- Password: `admin123` (configurable en `.env`)

#### Funcionalidades:

**1. Gestión de Encuestas** (`/admin/surveys`)
- Ver todas las encuestas creadas
- Estadísticas en tiempo real
- Copiar links públicos
- Abrir encuestas en nueva pestaña

**2. Crear Encuesta** (`/admin/surveys/create`)
- Título y descripción
- Tipo: Evaluación Docente, Institucional, Personalizada
- Estado: Borrador o Activa
- Seleccionar docentes (para evaluaciones)
- Crear preguntas dinámicas:
  - **Texto**: Respuesta corta
  - **Texto Largo**: Textarea
  - **Calificación**: Rating con min/max customizable
  - **Opción Única**: Radio buttons
  - **Opción Múltiple**: Checkboxes
- Al crear, se genera automáticamente un **link único**

**3. Métricas** (`/admin/surveys/metrics?id=SURVEY_ID`)
- Total de respuestas
- Tasa de finalización
- Ver respuestas individuales con detalles

**4. Gestión de Docentes** (`/admin/teachers`)
- Ver docentes en BD
- Agregar nuevos docentes

### Encuestas Públicas (/survey/[uniqueLink])

#### Flujo para Estudiantes:

1. **Acceso**: Admin comparte link único: `/survey/abc123xyz0`
2. **Login**: Estudiante ingresa código de 8 caracteres
3. **Validación**: Sistema verifica contra BD
4. **Sesión**: Se crea sesión con token único (24h de expiración)
5. **Completar**: Estudiante responde preguntas dinámicas
6. **Envío**: Respuestas se guardan en BD

#### Características:
- Diseño original mantenido (header azul PUCP)
- Formulario dinámico que renderiza cualquier tipo de pregunta
- Validación de campos requeridos
- Notificaciones visuales
- Modal de éxito al completar

---

## 🔧 Comandos Útiles

```bash
# Base de Datos
npm run db:seed      # Poblar datos iniciales
npm run db:migrate   # Aplicar migraciones
npm run db:studio    # Abrir Prisma Studio (GUI)

# Desarrollo
npm run dev          # Servidor desarrollo
npm run build        # Build producción
npm start            # Servidor producción
```

---

## 📊 Base de Datos

### Modelos Principales:

- **Survey**: Encuestas con link único
- **Question**: Preguntas dinámicas de cada encuesta
- **Teacher**: Docentes en el sistema
- **Student**: Estudiantes (código 8 caracteres)
- **Session**: Sesiones de respuesta con tokens
- **Response**: Respuestas completas
- **Answer**: Respuestas individuales a preguntas

### Datos Seed Iniciales:

**Estudiantes** (6):
- ALU20001 a ALU20010

**Docentes** (12):
- Distribuidos en 4 diplomaturas

**Admin** (1):
- admin@pucp.edu.pe

---

## 🎯 Flujo Completo

### Admin crea encuesta:

1. Login → `/admin`
2. Click "Nueva Encuesta"
3. Completar formulario:
   - Título: "Evaluación Docente 2024-1"
   - Tipo: "teacher_evaluation"
   - Estado: "active"
   - Seleccionar docentes
   - Agregar preguntas dinámicas
4. Click "Crear Encuesta"
5. Sistema genera link: `/survey/xyz123abc`
6. Admin copia y comparte link

### Estudiante responde:

1. Accede al link compartido
2. Ingresa código: `ALU20001`
3. Sistema valida y crea sesión
4. Responde preguntas dinámicas
5. Envía formulario
6. Respuestas guardadas en BD

### Admin ve métricas:

1. `/admin/surveys`
2. Click "Métricas" en encuesta
3. Ve:
   - Total respuestas
   - Respuestas individuales
   - Estadísticas

---

## ⚠️ Notas Importantes

1. **Códigos de estudiante**: Ahora son de **8 caracteres** (no 10)
2. **Links únicos**: Se generan automáticamente con nanoid (10 chars)
3. **Sesiones**: Expiran en 24 horas automáticamente
4. **Respuestas**: Se almacenan como JSON para flexibilidad
5. **MySQL**: Puerto 3307 (no 3306 por conflicto)

---

## 🔄 Archivos Eliminados (Obsoletos)

- `src/lib/database.js` - Base de datos en memoria
- `src/lib/database/admin-db.ts` - Admin DB en memoria
- `src/lib/data.js` - Datos hardcodeados
- `src/lib/api.js` - API antiguo

---

## 🆕 Archivos Nuevos Clave

- `src/lib/prisma.ts` - Cliente Prisma singleton
- `src/components/survey/DynamicSurveyForm.tsx` - Formulario dinámico
- `src/app/survey/[uniqueLink]/page.tsx` - Vista pública encuestas
- `src/app/api/survey/` - APIs públicas
- `src/app/api/admin/surveys/` - APIs admin
- `prisma/schema.prisma` - Schema completo BD
- `prisma/seed.ts` - Datos iniciales

---

## 📝 Variables de Entorno (.env)

```env
DATABASE_URL="mysql://root:root@localhost:3307/surveys"
ADMIN_PASSWORD="admin123"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## ✅ Todo Implementado

1. ✅ Página de inicio con menú de acceso
2. ✅ Panel admin para crear encuestas dinámicas
3. ✅ Componente de formulario dinámico
4. ✅ Dashboard de métricas
5. ✅ Sistema de links únicos
6. ✅ Base de datos MySQL + Prisma
7. ✅ Diseño original mantenido
8. ✅ Archivos obsoletos eliminados
9. ✅ Rutas correctamente organizadas

---

¡Proyecto completamente funcional y listo para usar! 🎉
