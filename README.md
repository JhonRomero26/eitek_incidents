# 🚨 Sistema de Gestión de Incidencias - EITEK

Sistema completo para la gestión de incidencias operativas internas, desarrollado con **Java Spring Boot** (Backend) y **React + TypeScript** (Frontend).

![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0-green?style=flat-square&logo=spring)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Ejecución](#-instalación-y-ejecución)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Documentation](#-api-documentation)
- [Flujo de Estados](#-flujo-de-estados)
- [Decisiones Técnicas](#-decisiones-técnicas)
- [Supuestos Realizados](#-supuestos-realizados)

---

## 📖 Descripción General

El **Sistema de Gestión de Incidencias** permite a los operadores:

- **Registrar** nuevas incidencias con información detallada
- **Consultar** el listado de incidencias con filtros por estado
- **Asignar** incidencias a responsables disponibles
- **Gestionar** el flujo de estados de cada incidencia
- **Visualizar** responsables y sus incidencias asignadas

El sistema implementa un flujo de estados controlado que garantiza la consistencia de las operaciones y previene acciones inválidas.

---

## ✨ Características

### Backend
- ✅ API REST completa con Spring Boot 4.0
- ✅ Documentación automática con Swagger/OpenAPI
- ✅ Validación de reglas de negocio
- ✅ Control de flujo de estados
- ✅ Manejo centralizado de errores
- ✅ Respuestas JSON consistentes

### Frontend
- ✅ Interfaz moderna con React 19 + TypeScript
- ✅ Arquitectura Hexagonal (Clean Architecture)
- ✅ Gestión de estados con Zustand
- ✅ Componentes UI con Radix UI + Tailwind CSS
- ✅ Manejo de estados de carga, error y éxito
- ✅ Routing con Wouter

---

## 🏗 Arquitectura

### Backend (Spring Boot)
```
backend/
├── src/main/java/com/eitek/
│   ├── controller/        # Controladores REST
│   ├── service/           # Lógica de negocio
│   ├── repository/        # Acceso a datos (JPA)
│   ├── model/             # Entidades de dominio
│   ├── dto/               # Objetos de transferencia
│   └── exception/         # Manejo de excepciones
```

### Frontend (React + TypeScript)
```
frontend/src/
├── core/                  # Dominio y reglas de negocio
│   ├── domain/            # Entidades del dominio
│   ├── repository/        # Interfaces de repositorios
│   └── services/          # Servicios de dominio
├── application/           # Casos de uso
│   ├── dto/               # DTOs
│   └── services/          # Servicios de aplicación
├── infrastructure/        # Implementaciones externas
│   ├── api/               # Cliente HTTP
│   └── repositories/      # Implementación de repositorios
├── presentation/          # Capa de presentación
│   ├── components/        # Componentes React
│   ├── pages/             # Páginas
│   ├── hooks/             # Hooks personalizados
│   └── layout/            # Layouts
└── shared/                # Utilidades compartidas
    ├── stores/            # Estados globales (Zustand)
    └── utils/             # Funciones utilitarias
```

---

## 🛠 Tecnologías

| Capa | Tecnología | Versión |
|------|------------|---------|
| **Backend** | Java | 21 |
| | Spring Boot | 4.0.1 |
| | Spring Data JPA | Latest |
| | PostgreSQL Driver | Latest |
| | Lombok | 1.18.30 |
| **Frontend** | React | 19.2.3 |
| | TypeScript | 5.9 |
| | Vite | 7.3.1 |
| | Tailwind CSS | 4.1.18 |
| | Zustand | 5.0.10 |
| | Wouter | 3.9.0 |
| **Base de Datos** | PostgreSQL | 16 |

---

## 📦 Requisitos Previos

- [Java JDK 21](https://adoptium.net/)
- [Node.js 22+](https://nodejs.org/) o [Bun](https://bun.sh/)
- [PostgreSQL 16](https://www.postgresql.org/download/)
- Make (generalmente preinstalado en Linux/Mac)

### Verificar requisitos

```bash
make check
```

---

## 🚀 Instalación y Ejecución

### Inicio Rápido

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/eitek_incidencias.git
cd eitek_incidencias

# 2. Ver comandos disponibles
make help

# 3. Instalar dependencias
make install

# 4. Iniciar base de datos (requiere Docker o PostgreSQL local)
make db
make db-init

# 5. Iniciar aplicación completa
make dev
```

### Comandos del Makefile

| Comando | Descripción |
|---------|-------------|
| `make help` | Mostrar todos los comandos disponibles |
| `make install` | Instalar todas las dependencias |
| `make dev` | Iniciar backend y frontend en paralelo |
| `make backend` | Iniciar solo el backend |
| `make frontend` | Iniciar solo el frontend |
| `make db` | Iniciar PostgreSQL con Docker |
| `make db-init` | Ejecutar schema.sql y seed.sql |
| `make db-reset` | Reiniciar la base de datos |
| `make stop` | Detener todos los servicios |
| `make test` | Ejecutar tests |
| `make build` | Construir para producción |
| `make clean` | Limpiar archivos generados |

### Ejecución Manual

#### 1. Base de Datos

**Opción A: Con Docker**
```bash
make db
make db-init
```

**Opción B: PostgreSQL Local**
```bash
# Crear la base de datos
psql -U postgres -c "CREATE DATABASE eitek;"

# Ejecutar scripts de inicialización
psql -U postgres -d eitek -f db/schema.sql
psql -U postgres -d eitek -f db/seed.sql
```

#### 2. Backend

```bash
cd backend
chmod +x gradlew
./gradlew bootRun
```

El backend estará disponible en: `http://localhost:8080`

#### 3. Frontend

```bash
cd frontend
bun install  # o npm install
bun dev      # o npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

---

## 📁 Estructura del Proyecto

```
eitek_incidencias/
├── 📂 backend/                 # API REST con Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/eitek/ # Código Java
│   │   │   └── resources/      # Configuraciones
│   │   └── test/               # Tests unitarios
│   └── build.gradle            # Configuración de Gradle
│
├── 📂 frontend/                # Aplicación React
│   ├── src/
│   │   ├── core/               # Dominio
│   │   ├── application/        # Servicios
│   │   ├── infrastructure/     # Implementaciones
│   │   ├── presentation/       # UI
│   │   └── shared/             # Compartido
│   └── package.json
│
├── 📂 db/                      # Scripts de base de datos
│   ├── schema.sql              # Esquema de tablas
│   └── seed.sql                # Datos de prueba
│
├── Makefile                    # Automatización de tareas
└── README.md                   # Esta documentación
```

---

## 📚 API Documentation

### Swagger UI

Una vez el backend esté corriendo, accede a la documentación interactiva:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

### Endpoints Principales

#### Incidencias

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/incidents` | Listar todas las incidencias |
| `GET` | `/api/incidents?status=OPEN` | Filtrar por estado |
| `GET` | `/api/incidents/{id}` | Obtener detalle de incidencia |
| `POST` | `/api/incidents` | Crear nueva incidencia |
| `PUT` | `/api/incidents/{id}` | Actualizar incidencia |
| `PATCH` | `/api/incidents/{id}/assign` | Asignar responsable |
| `PATCH` | `/api/incidents/{id}/status` | Cambiar estado |

#### Responsables (Assignees)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/assignees` | Listar responsables |
| `GET` | `/api/assignees/active` | Filtrar activos |
| `GET` | `/api/assignees/{id}` | Obtener detalle |
| `PUT` | `/api/assignees/{id}/activate` | Activar responsable |
| `PUT` | `/api/assignees/{id}/deactivate` | Desactivar responsable |

### Probar con cURL

```bash
# Listar incidencias
curl http://localhost:8080/api/incidents

# Crear incidencia
curl -X POST http://localhost:8080/api/incidents \
  -H "Content-Type: application/json" \
  -d '{"title": "Nueva incidencia", "description": "Descripción detallada"}'

# Asignar responsable
curl -X PATCH http://localhost:8080/api/incidents/1/assign \
  -H "Content-Type: application/json" \
  -d '{"assigneeId": 2}'

# Cambiar estado
curl -X PATCH http://localhost:8080/api/incidents/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "IN_PROGRESS"}'
```

---

## 🔄 Flujo de Estados

Las incidencias siguen un flujo de estados controlado:

```
┌──────────┐     ┌──────────┐     ┌─────────────┐     ┌──────────┐
│   OPEN   │────▶│ ASSIGNED │────▶│ IN_PROGRESS │────▶│ RESOLVED │
└──────────┘     └──────────┘     └─────────────┘     └──────────┘
```

### Reglas de Transición

| Estado Actual | Estados Permitidos | Condición |
|---------------|-------------------|-----------|
| `OPEN` | `ASSIGNED` | Requiere asignar responsable |
| `ASSIGNED` | `IN_PROGRESS` | Responsable inicia trabajo |
| `IN_PROGRESS` | `RESOLVED` | Trabajo completado |

### Reglas de Asignación

- Solo se puede asignar una incidencia en estado `OPEN`
- Al asignar, el estado cambia automáticamente a `ASSIGNED`
- Solo se pueden asignar responsables activos (`is_active = true`)

---

## 🧠 Decisiones Técnicas

### Backend

1. **Spring Boot 4.0**: Última versión estable con soporte completo para Java 21.

2. **Arquitectura en capas**: Separación clara entre Controller, Service y Repository.

3. **DTOs separados**: Uso de DTOs para request/response evitando exponer entidades directamente.

4. **Validación en capa de servicio**: La lógica de negocio y validaciones residen en los servicios.

5. **PostgreSQL**: Base de datos robusta con soporte para tipos ENUM nativos.

### Frontend

1. **Arquitectura Hexagonal**: Separación clara entre dominio, aplicación e infraestructura.

2. **TypeScript estricto**: Tipado fuerte para prevenir errores en tiempo de desarrollo.

3. **Zustand para estado global**: Alternativa ligera a Redux.

4. **Wouter para routing**: Router minimalista (<1.5KB).

5. **Radix UI + Tailwind**: Componentes accesibles y estilización utility-first.

---

## 📝 Supuestos Realizados

1. **Estado IN_PROGRESS**: Se agregó el estado `IN_PROGRESS` al flujo para representar el progreso activo de trabajo en una incidencia.

2. **Asignación única**: Una incidencia solo puede tener un responsable a la vez.

3. **Responsables inactivos**: Los responsables marcados como inactivos (`is_active = false`) no pueden recibir nuevas asignaciones pero mantienen sus incidencias previas.

4. **Sin autenticación**: El sistema no implementa autenticación/autorización ya que no fue requerido explícitamente.

5. **Fecha de asignación**: Se registra automáticamente al asignar una incidencia.

6. **Sin eliminación de incidencias**: Las incidencias no se pueden eliminar, solo cambiar de estado.

7. **Selección de usuario**: El frontend implementa un selector de usuario simulado para demostrar el flujo.

---

## 🧪 Testing

```bash
# Ejecutar todos los tests
make test

# Solo backend
make test-backend

# Solo frontend
make test-frontend
```

---

## 📄 Licencia

Este proyecto fue desarrollado como prueba técnica para EITEK.
