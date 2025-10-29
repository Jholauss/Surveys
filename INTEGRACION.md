# Guía de Integración - Carga de Docentes y Encuestas

Esta guía explica cómo utilizar el sistema de integración para cargar docentes (con fotos) y encuestas a la base de datos MySQL.

## 📋 Índice

1. [APIs Disponibles](#apis-disponibles)
2. [Subir Foto de Docente](#subir-foto-de-docente)
3. [Carga Masiva de Docentes](#carga-masiva-de-docentes)
4. [Carga Masiva de Encuestas](#carga-masiva-de-encuestas)
5. [Script de Importación](#script-de-importación)
6. [Ejemplos de Uso](#ejemplos-de-uso)

---

## APIs Disponibles

### 1. Upload de Foto Individual
**Endpoint:** `POST /api/admin/teachers/upload-photo`

Sube una foto de docente (JPEG, PNG o WebP, máx 5MB).

**Request:** FormData con campo `photo`

**Response:**
```json
{
  "success": true,
  "photoUrl": "/uploads/teachers/teacher_1234567890.jpg",
  "fileName": "teacher_1234567890.jpg"
}
```

### 2. Carga Masiva de Docentes
**Endpoint:** `POST /api/admin/teachers/bulk`

Crea múltiples docentes de una vez, con soporte para fotos en base64.

**Request:**
```json
{
  "teachers": [
    {
      "name": "Dr. Juan Pérez",
      "email": "juan.perez@university.edu",
      "subject": "Matemáticas",
      "diplomatura": "Ingeniería",
      "photoBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "status": "active"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "total": 1,
    "created": 1,
    "errors": 0
  },
  "results": {
    "created": [
      {
        "id": "clxxx...",
        "name": "Dr. Juan Pérez",
        "photo": "/uploads/teachers/teacher_1234567890.jpg"
      }
    ],
    "errors": []
  }
}
```

### 3. Carga Masiva de Encuestas
**Endpoint:** `POST /api/admin/surveys/bulk`

Crea múltiples encuestas con sus preguntas y docentes asociados.

**Request:**
```json
{
  "surveys": [
    {
      "title": "Evaluación Docente 2025",
      "description": "Encuesta de evaluación...",
      "type": "teacher_evaluation",
      "status": "active",
      "requiresCode": true,
      "teacherNames": ["Dr. Juan Pérez", "Dra. María González"],
      "questions": [
        {
          "type": "rating",
          "question": "¿Cómo califica el dominio del tema?",
          "minValue": 1,
          "maxValue": 5,
          "required": true
        }
      ]
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "total": 1,
    "created": 1,
    "errors": 0
  },
  "results": {
    "created": [
      {
        "id": "clxxx...",
        "title": "Evaluación Docente 2025",
        "uniqueLink": "abc123xyz0",
        "publicLink": "http://localhost:3000/survey/abc123xyz0",
        "questionsCount": 1,
        "teachersCount": 2
      }
    ],
    "errors": []
  }
}
```

---

## Subir Foto de Docente

### Con cURL

```bash
curl -X POST http://localhost:3000/api/admin/teachers/upload-photo \
  -H "Cookie: admin_session=..." \
  -F "photo=@foto-docente.jpg"
```

### Con JavaScript (Frontend)

```javascript
const formData = new FormData();
formData.append('photo', fileInput.files[0]);

const response = await fetch('/api/admin/teachers/upload-photo', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result.photoUrl); // "/uploads/teachers/teacher_xxx.jpg"
```

---

## Carga Masiva de Docentes

### Con Foto en Base64

```javascript
// 1. Convertir imagen a base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// 2. Preparar datos
const photoBase64 = await fileToBase64(fileInput.files[0]);

const teachers = [
  {
    name: "Dr. Juan Pérez",
    email: "juan.perez@university.edu",
    subject: "Matemáticas",
    diplomatura: "Ingeniería",
    photoBase64: photoBase64, // "data:image/jpeg;base64,..."
    status: "active"
  }
];

// 3. Enviar a la API
const response = await fetch('/api/admin/teachers/bulk', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ teachers })
});

const result = await response.json();
console.log(result);
```

### Con cURL

```bash
curl -X POST http://localhost:3000/api/admin/teachers/bulk \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_session=..." \
  -d '{
    "teachers": [
      {
        "name": "Dr. Juan Pérez",
        "email": "juan.perez@university.edu",
        "subject": "Matemáticas",
        "diplomatura": "Ingeniería",
        "status": "active"
      }
    ]
  }'
```

---

## Carga Masiva de Encuestas

### Ejemplo Completo

```javascript
const surveys = [
  {
    title: "Evaluación Docente - Semestre 1",
    description: "Encuesta de evaluación del desempeño docente",
    type: "teacher_evaluation",
    status: "active",
    requiresCode: true,
    allowAnonymous: false,
    teacherNames: ["Dr. Juan Pérez", "Dra. María González"],
    questions: [
      {
        type: "rating",
        question: "¿Cómo califica el dominio del tema?",
        description: "Siendo 1 muy malo y 5 excelente",
        required: true,
        minValue: 1,
        maxValue: 5
      },
      {
        type: "textarea",
        question: "Comentarios adicionales",
        required: false
      }
    ]
  }
];

const response = await fetch('/api/admin/surveys/bulk', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ surveys })
});

const result = await response.json();
console.log(result.results.created);
```

---

## Script de Importación

El script `scripts/import-data.ts` permite importar datos desde archivos JSON.

### Instalación de Dependencias

```bash
npm install tsx --save-dev
```

### Uso Básico

```bash
# Importar solo docentes
npx tsx scripts/import-data.ts --teachers data/teachers.json

# Importar solo encuestas
npx tsx scripts/import-data.ts --surveys data/surveys.json

# Importar ambos
npx tsx scripts/import-data.ts --teachers data/teachers.json --surveys data/surveys.json
```

### Variables de Entorno

Configura las siguientes variables en `.env`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### Formato de Archivos JSON

#### teachers.json

```json
[
  {
    "name": "Dr. Juan Pérez",
    "email": "juan.perez@university.edu",
    "subject": "Matemáticas Avanzadas",
    "diplomatura": "Ingeniería de Sistemas",
    "status": "active"
  }
]
```

#### surveys.json

```json
[
  {
    "title": "Evaluación Docente 2025",
    "type": "teacher_evaluation",
    "status": "active",
    "teacherNames": ["Dr. Juan Pérez"],
    "questions": [
      {
        "type": "rating",
        "question": "¿Cómo califica el dominio del tema?",
        "minValue": 1,
        "maxValue": 5
      }
    ]
  }
]
```

---

## Ejemplos de Uso

### 1. Cargar Docentes con Fotos desde Python

```python
import requests
import base64
import json

# Leer y codificar imagen
with open('foto.jpg', 'rb') as f:
    photo_base64 = 'data:image/jpeg;base64,' + base64.b64encode(f.read()).decode()

# Preparar datos
teachers = [
    {
        'name': 'Dr. Juan Pérez',
        'email': 'juan.perez@university.edu',
        'subject': 'Matemáticas',
        'diplomatura': 'Ingeniería',
        'photoBase64': photo_base64,
        'status': 'active'
    }
]

# Hacer login primero
login = requests.post('http://localhost:3000/api/admin/login', json={
    'email': 'admin@example.com',
    'password': 'admin123'
})

cookies = login.cookies

# Enviar docentes
response = requests.post(
    'http://localhost:3000/api/admin/teachers/bulk',
    json={'teachers': teachers},
    cookies=cookies
)

print(response.json())
```

### 2. Cargar Encuestas desde Node.js

```javascript
const fs = require('fs');

async function importSurveys() {
  // Login
  const loginRes = await fetch('http://localhost:3000/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@example.com',
      password: 'admin123'
    })
  });

  const cookie = loginRes.headers.get('set-cookie');

  // Leer archivo de encuestas
  const surveys = JSON.parse(fs.readFileSync('surveys.json', 'utf8'));

  // Importar
  const response = await fetch('http://localhost:3000/api/admin/surveys/bulk', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie
    },
    body: JSON.stringify({ surveys })
  });

  const result = await response.json();
  console.log(result);
}

importSurveys();
```

---

## Tipos de Preguntas Soportados

- **text**: Respuesta de texto corto
- **textarea**: Respuesta de texto largo
- **rating**: Calificación numérica (minValue/maxValue)
- **multiple_choice**: Selección única (requiere options)
- **checkbox**: Selección múltiple (requiere options)

---

## Notas Importantes

1. **Autenticación**: Todas las APIs requieren sesión de admin activa
2. **Fotos**: Máximo 5MB, formatos: JPEG, PNG, WebP
3. **Links únicos**: Se generan automáticamente con nanoid (10 caracteres)
4. **teacherNames vs teacherIds**: Puedes usar nombres (se buscan en BD) o IDs directamente
5. **Status**: Los docentes y encuestas tienen status (active/inactive/draft)

---

## Troubleshooting

### Error: "Unauthorized"
- Asegúrate de estar autenticado como admin
- Verifica que la cookie de sesión sea válida

### Error: "Failed to upload photo"
- Verifica que el archivo sea una imagen válida
- Comprueba que el tamaño no exceda 5MB
- Asegúrate de que el directorio `public/uploads/teachers/` exista

### Error al importar encuestas con teacherNames
- Verifica que los nombres de los docentes existan en la BD
- Los nombres deben coincidir exactamente (case-sensitive)

---

¿Necesitas ayuda? Revisa los logs del servidor para más detalles sobre los errores.
