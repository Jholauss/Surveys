# Guía de Verificación y Troubleshooting

## ✅ Pasos para Verificar que Todo Funcione

### 1. Verificar Base de Datos

```bash
# En tu consola, ejecuta:
npm run db:studio
```

Esto abrirá Prisma Studio en tu navegador. Verifica que:
- Exista la tabla `teachers`
- Exista la tabla `surveys`
- Exista la tabla `admins`

### 2. Verificar que Docker MySQL esté corriendo

```bash
docker ps
```

Deberías ver un contenedor llamado `surveys` corriendo. Si no está corriendo:

```bash
docker start surveys
```

O crear uno nuevo:

```bash
docker run --name surveys -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=surveys -p 3307:3306 -d mysql:8.0
```

### 3. Aplicar Migraciones (si es necesario)

```bash
npm run db:migrate
```

### 4. Crear datos de prueba (opcional)

```bash
npm run db:seed
```

### 5. Iniciar el servidor

```bash
npm run dev
```

El servidor debería iniciar en http://localhost:3000

---

## 🔍 Verificación de Autenticación

### Paso 1: Ir a Login

Navega a: http://localhost:3000/login

### Paso 2: Intentar login con credenciales

**Credenciales por defecto:**
- Email: `admin@pucp.edu.pe` o `evaluaciones@pucp.edu.pe`
- Password: `admin123`

**Si usas variable de entorno:**
```env
ADMIN_PASSWORD=tu_password_personalizado
```

### Paso 3: Verificar cookies en DevTools

1. Abre DevTools (F12)
2. Ve a la pestaña "Application" o "Aplicación"
3. En la sección "Cookies" debería aparecer:
   - Nombre: `admin_session`
   - Valor: `authenticated`
   - Path: `/`
   - HttpOnly: ✓

### Paso 4: Probar acceso a Gestión de Docentes

Navega a: http://localhost:3000/admin/teachers

**Debería:**
- Mostrarte la página de gestión de docentes
- Si no hay docentes, mostrar: "No hay docentes registrados..."
- El botón "Nuevo Docente" debería funcionar

---

## 🐛 Troubleshooting

### Error: "Unauthorized" al cargar docentes

**Causa:** La cookie de sesión no está configurada o no se está enviando correctamente.

**Solución:**
1. Cierra sesión completamente (borra cookies)
2. Vuelve a hacer login
3. Verifica en DevTools que la cookie `admin_session` tenga `Path: /`

### Error: "Failed to fetch teachers" o "Error de conexión"

**Causa:** Prisma no puede conectarse a la base de datos.

**Solución:**
1. Verifica que Docker MySQL esté corriendo: `docker ps`
2. Verifica la conexión en `.env`:
   ```
   DATABASE_URL="mysql://root:root@localhost:3307/surveys"
   ```
3. Reinicia el servidor de desarrollo

### Error: "Table 'surveys.teachers' doesn't exist"

**Causa:** Las migraciones no se han aplicado.

**Solución:**
```bash
npm run db:migrate
```

### Los docentes no se muestran en "Crear Encuesta"

**Causa:** No hay docentes en la base de datos.

**Solución:**
1. Ve a http://localhost:3000/admin/teachers
2. Crea al menos 1 docente con el botón "Nuevo Docente"
3. Vuelve a "Crear Nueva Encuesta"

### El modal de "Nuevo Docente" no aparece

**Causa:** Error de JavaScript en el navegador.

**Solución:**
1. Abre DevTools (F12) y ve a la consola
2. Busca errores en rojo
3. Copia el error y revisa

### Error al subir foto de docente

**Causa:** El directorio no existe o no tiene permisos.

**Solución:**
```bash
mkdir -p public/uploads/teachers
```

En Windows (PowerShell):
```powershell
New-Item -ItemType Directory -Force -Path "public\uploads\teachers"
```

---

## 📝 Logs Útiles para Depuración

Cuando el servidor esté corriendo, deberías ver en la consola:

### Login exitoso:
```
POST /api/admin/login 200 in 50ms
```

### Carga de docentes exitosa:
```
[Teachers API] Verificando autenticación...
[Teachers API] Autenticado, obteniendo docentes...
[Teachers API] Encontrados 0 docentes
GET /api/admin/teachers 200 in 120ms
```

### Creación de docente exitosa:
```
[Teachers API POST] Verificando autenticación...
[Teachers API POST] Creando docente: Dr. Juan Pérez
[Teachers API POST] Docente creado: clxxx...
POST /api/admin/teachers 200 in 200ms
```

---

## 🧪 Probar Integración de Datos

### Opción 1: Desde la interfaz

1. Ve a http://localhost:3000/admin/teachers
2. Clic en "Nuevo Docente"
3. Llena el formulario
4. Sube una foto (opcional)
5. Clic en "Crear Docente"

### Opción 2: Carga masiva con script

```bash
# Edita data/teachers.json con tus docentes
npm run import:teachers data/teachers.json

# Edita data/surveys.json con tus encuestas
npm run import:surveys data/surveys.json
```

---

## 🔑 Agregar más Admins

Edita el archivo `src/lib/admin/auth.ts`:

```typescript
const ADMIN_EMAILS = [
  'admin@pucp.edu.pe',
  'evaluaciones@pucp.edu.pe',
  'tu-email@pucp.edu.pe'  // Agregar aquí
];
```

Reinicia el servidor después del cambio.

---

## 🆘 Si nada funciona

1. **Detener el servidor** (Ctrl + C)
2. **Limpiar todo:**
   ```bash
   # Limpiar node_modules
   rm -rf node_modules
   npm install

   # Limpiar .next
   rm -rf .next
   ```
3. **Reiniciar Docker:**
   ```bash
   docker stop surveys
   docker start surveys
   ```
4. **Aplicar migraciones de nuevo:**
   ```bash
   npm run db:migrate
   ```
5. **Iniciar servidor:**
   ```bash
   npm run dev
   ```

---

## 📞 Información de Contacto en Logs

Si sigues teniendo problemas, copia y envía:

1. Los logs de la consola del servidor
2. Los logs de la consola del navegador (F12 > Console)
3. La respuesta de la API en Network tab (F12 > Network)

Ejemplo de cómo ver la respuesta de la API:
1. F12 > Network
2. Intenta cargar docentes
3. Busca la petición a `/api/admin/teachers`
4. Clic derecho > Copy > Copy Response
