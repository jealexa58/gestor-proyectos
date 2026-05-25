# Gestor de Proyectos

Aplicación web de gestión de proyectos que adapta su interfaz y flujo de trabajo según el sector económico del proyecto. Al crear un proyecto, el usuario selecciona entre dos sectores: Software y Construcción. A partir de esa selección, la aplicación presenta un entorno completamente diferente, con terminología, herramientas y vistas específicas para cada contexto.

El sector Software ofrece un tablero Kanban con gestión de tareas ágiles, tipos de ítem (feature, bug, tarea) y control de prioridades. El sector Construcción presenta un cronograma de hitos con seguimiento de avance, lista de materiales y control de planos. Los dos entornos son mutuamente excluyentes: no se mezclan datos ni vistas entre sectores.


## Stack tecnológico

**Frontend**
- React 18 con TypeScript
- React Router v6
- Context API para estado global
- Axios para consumo de la API
- Tailwind CSS

**Backend**
- NestJS con TypeScript
- TypeORM + PostgreSQL
- Autenticación JWT con Passport
- Swagger para documentación de la API
- Validación de DTOs con class-validator


## Estructura del repositorio

```
gestor-proyectos/
├── frontend/       Aplicación React + Vite
├── backend/        API REST con NestJS
└── docker-compose.yml
```


## Requisitos previos

- Node.js 20 o superior
- PostgreSQL 14 o superior (o Docker)
- npm


## Configuración

### Base de datos con Docker

La forma más rápida de levantar la base de datos es con Docker Compose. Desde la raíz del proyecto:

```bash
cp .env.example .env
docker compose up -d
```

Esto levanta PostgreSQL en el puerto 5432 y pgAdmin en http://localhost:5050. Las credenciales de pgAdmin son `admin@gp.com` / `admin`. Para conectarte al servidor desde pgAdmin usa `gp_db` como host.

### Backend

```bash
cd backend
cp .env.example .env
```

Edita el archivo `.env` con las credenciales de tu base de datos:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=gestorproyectos
JWT_SECRET=un_secreto_seguro
```

Instala dependencias e inicia el servidor:

```bash
npm install
npm run start:dev
```

La API queda disponible en `http://localhost:3000/api`. La documentación Swagger está en `http://localhost:3000/api/docs`.

### Frontend

```bash
cd frontend
cp .env.example .env
```

Para desarrollo con datos reales del backend:
```
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCKS=false
```

Para desarrollo sin backend (datos simulados):
```
VITE_USE_MOCKS=true
```

```bash
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.


## Credenciales de prueba

Cuando `VITE_USE_MOCKS=true`, puedes ingresar con:

```
Correo:     demo@gp.com
Contraseña: demo1234
```


## Endpoints de la API

Todos los endpoints excepto los de autenticación requieren el header `Authorization: Bearer <token>`.

**Autenticación**

| Método | Ruta              | Descripción              |
|--------|-------------------|--------------------------|
| POST   | /api/auth/register | Registrar usuario        |
| POST   | /api/auth/login    | Iniciar sesión           |

**Proyectos**

| Método | Ruta                | Descripción                  |
|--------|---------------------|------------------------------|
| GET    | /api/projects       | Listar proyectos del usuario |
| GET    | /api/projects/:id   | Obtener un proyecto          |
| POST   | /api/projects       | Crear proyecto               |
| DELETE | /api/projects/:id   | Eliminar proyecto            |

**Tareas (sector Software)**

| Método | Ruta                              | Descripción          |
|--------|-----------------------------------|----------------------|
| GET    | /api/projects/:id/tasks           | Listar tareas        |
| POST   | /api/projects/:id/tasks           | Crear tarea          |
| PATCH  | /api/tasks/:id                    | Actualizar tarea     |
| DELETE | /api/tasks/:id                    | Eliminar tarea       |

**Hitos y materiales (sector Construcción)**

| Método | Ruta                              | Descripción              |
|--------|-----------------------------------|--------------------------|
| GET    | /api/projects/:id/hitos           | Listar hitos             |
| POST   | /api/projects/:id/hitos           | Crear hito               |
| PATCH  | /api/hitos/:id                    | Actualizar avance        |
| GET    | /api/projects/:id/materiales      | Listar materiales/planos |


## Variables de entorno

**Raíz del proyecto** (usado por Docker Compose)

| Variable      | Descripción                        | Default           |
|---------------|------------------------------------|-------------------|
| DB_USER       | Usuario de PostgreSQL              | postgres          |
| DB_PASSWORD   | Contraseña de PostgreSQL           | postgres          |
| DB_NAME       | Nombre de la base de datos         | gestorproyectos   |
| JWT_SECRET    | Secreto para firmar tokens JWT     |                   |
| VITE_API_URL  | URL base de la API para el frontend| http://localhost:3000/api |

**Backend** (backend/.env)

| Variable       | Descripción                 | Default |
|----------------|-----------------------------|---------|
| DB_HOST        | Host de PostgreSQL          | localhost |
| DB_PORT        | Puerto de PostgreSQL        | 5432    |
| JWT_EXPIRES_IN | Expiración del JWT          | 7d      |
| PORT           | Puerto del servidor         | 3000    |

**Frontend** (frontend/.env)

| Variable        | Descripción                        | Default |
|-----------------|------------------------------------|---------|
| VITE_API_URL    | URL base de la API REST            | http://localhost:3000/api |
| VITE_USE_MOCKS  | Usar datos simulados sin backend   | true    |


## Notas de desarrollo

El campo `synchronize: true` en la configuración de TypeORM crea y actualiza las tablas automáticamente al iniciar el backend. Esto es conveniente en desarrollo pero no debe usarse en producción. Para producción se deben usar migraciones de TypeORM.

La contraseña del usuario nunca se retorna en las respuestas de la API. La columna está marcada con `select: false` en la entidad y se excluye manualmente en el servicio de autenticación.
