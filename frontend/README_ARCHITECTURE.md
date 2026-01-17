# Frontend - Arquitectura Hexagonal

## 📁 Estructura del Proyecto

```
src/
├── core/                              # 🔵 DOMINIO (Lógica de negocio pura)
│   ├── domain/                        # Entidades y modelos
│   │   ├── Assignee.ts               # Modelo Assignee con métodos de negocio
│   │   ├── Incident.ts               # Modelo Incident con métodos de negocio
│   │   ├── AssigneeRoles.ts          # Enum de roles
│   │   └── IncidentStatus.ts         # Enum de estados
│   │
│   └── services/                      # Servicios de dominio (lógica compleja)
│       └── IncidentAssignmentValidator.ts  # Validación de asignación
│
├── application/                       # 🟢 APLICACIÓN (Casos de uso)
│   ├── dto/                          # Data Transfer Objects
│   │   ├── AssigneeDTO.ts
│   │   └── IncidentDTO.ts
│   │
│   └── services/                      # Servicios de aplicación
│       ├── AssigneeService.ts        # Orquesta operaciones de Assignee
│       └── IncidentService.ts        # Orquesta operaciones de Incident
│
├── infrastructure/                    # 🟡 INFRAESTRUCTURA (Adaptadores externos)
│   ├── api/                          # Cliente HTTP
│   │   └── ApiClient.ts              # Cliente genérico para API REST
│   │
│   └── repositories/                  # Implementaciones de repositorios
│       ├── AssigneeRepository.ts     # Comunicación con /api/assignees
│       └── IncidentRepository.ts     # Comunicación con /api/incidents
│
├── presentation/                      # 🎨 PRESENTACIÓN (UI)
│   ├── components/                    # Componentes React reutilizables
│   ├── pages/                        # Páginas/vistas de la aplicación
│   └── hooks/                        # Custom hooks de React
│       ├── useIncidents.ts           # Hook para gestión de incidents
│       ├── useAssignees.ts           # Hook para gestión de assignees
│       └── useIncidentPermissions.ts # Hook para validar permisos
│
└── shared/                           # 🔧 COMPARTIDO
    ├── types/                        # Tipos compartidos
    └── utils/                        # Utilidades generales
```

## 🎯 Flujo de Datos

```
Component (UI)
    ↓
Custom Hook (useIncidents)
    ↓
Application Service (IncidentService)
    ↓
Repository (IncidentRepository)
    ↓
API Client (ApiClient)
    ↓
Backend API
```

## 📦 Responsabilidades por Capa

### 🔵 Core (Dominio)
- **Qué hace**: Contiene la lógica de negocio pura
- **No depende de**: Nada (independiente)
- **Ejemplo**: `assignee.canDeleteIncidents()`, `incident.canBeEdited()`

### 🟢 Application
- **Qué hace**: Orquesta casos de uso, convierte DTOs a modelos de dominio
- **Depende de**: Core
- **Ejemplo**: `service.getAllIncidents()` → convierte DTOs a Incidents

### 🟡 Infrastructure  
- **Qué hace**: Comunicación con APIs externas, persistencia
- **Depende de**: Application (DTOs)
- **Ejemplo**: `repository.findAll()` → fetch a `/api/incidents`

### 🎨 Presentation
- **Qué hace**: Renderiza UI, maneja interacción del usuario
- **Depende de**: Application, Core
- **Ejemplo**: `useIncidents()` hook que usa `IncidentService`

## 🚀 Uso

### 1. En un componente React:

\`\`\`tsx
import { useIncidents } from "@/presentation/hooks/useIncidents";
import { useIncidentPermissions } from "@/presentation/hooks/useIncidentPermissions";

function IncidentList() {
    const { incidents, loading, deleteIncident } = useIncidents();
    const currentUser = null; // Obtener del contexto de auth
    const { canDeleteIncidents } = useIncidentPermissions(currentUser);

    const handleDelete = async (id: number) => {
        if (currentUser) {
            await deleteIncident(id, currentUser.id);
        }
    };

    return (
        <div>
            {incidents.map(incident => (
                <div key={incident.id}>
                    <h3>{incident.title}</h3>
                    
                    {/* Lógica de dominio */}
                    {incident.canBeEdited() && <button>Edit</button>}
                    
                    {/* Permisos de usuario */}
                    {canDeleteIncidents && (
                        <button onClick={() => handleDelete(incident.id)}>
                            Delete
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
\`\`\`

### 2. Llamadas directas al servicio (opcional):

\`\`\`tsx
import { IncidentService } from "@/application/services/IncidentService";

const service = new IncidentService();
const incidents = await service.getAllIncidents();
\`\`\`

## ⚙️ Configuración

### Variables de entorno:

Copia `.env.example` a `.env`:

\`\`\`bash
cp .env.example .env
\`\`\`

Configura la URL del backend:

\`\`\`env
VITE_API_URL=http://localhost:8080
\`\`\`

## 🧪 Testing

### Testear el dominio (sin dependencias):
\`\`\`typescript
import { Assignee } from "@/core/domain/Assignee";

test("Admin can delete incidents", () => {
    const admin = new Assignee({ role: "ADMIN", ... });
    expect(admin.canDeleteIncidents()).toBe(true);
});
\`\`\`

### Testear servicios de aplicación (mock del repository):
\`\`\`typescript
import { IncidentService } from "@/application/services/IncidentService";

test("Gets all incidents", async () => {
    const mockRepo = { findAll: jest.fn().mockResolvedValue([...]) };
    const service = new IncidentService();
    // Inyectar mockRepo...
});
\`\`\`

## ✅ Ventajas

- ✅ **Separación de responsabilidades clara**
- ✅ **Fácil de testear** (cada capa independiente)
- ✅ **Mantenible** (cambios en UI no afectan dominio)
- ✅ **Escalable** (agregar features sin tocar otras capas)
- ✅ **Reutilizable** (dominio sirve para web, mobile, etc.)

## 📚 Más información

Ver [ARQUITECTURA_HEXAGONAL.md](./ARQUITECTURA_HEXAGONAL.md) para detalles completos.
