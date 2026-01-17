# Arquitectura Hexagonal en Frontend (TypeScript/React)

## 📐 Estructura Simplificada

```
frontend/src/
├── core/                           # 🔵 CAPA DE DOMINIO (núcleo)
│   ├── domain/                     # Entidades y reglas de negocio
│   │   ├── Assignee.ts            # Modelo de dominio con lógica
│   │   ├── Incident.ts            # Modelo de dominio con lógica
│   │   ├── AssigneeRoles.ts       # Enums y tipos del dominio
│   │   └── IncidentStatus.ts      # Enums y tipos del dominio
│   │
│   └── services/                   # Servicios de dominio (lógica compleja)
│       └── IncidentAssignmentValidator.ts
│
├── application/                    # 🟢 CAPA DE APLICACIÓN (casos de uso)
│   ├── dto/                        # DTOs para comunicación con backend
│   │   ├── AssigneeDTO.ts
│   │   └── IncidentDTO.ts
│   │
│   └── services/                   # Servicios de aplicación (orquestación)
│       ├── AssigneeService.ts     # Orquesta operaciones de Assignee
│       └── IncidentService.ts     # Orquesta operaciones de Incident
│
├── infrastructure/                 # 🟡 CAPA DE INFRAESTRUCTURA (adaptadores)
│   ├── api/                        # Adaptadores de API (HTTP)
│   │   ├── AssigneeApiAdapter.ts  # Llamadas HTTP para Assignee
│   │   └── IncidentApiAdapter.ts  # Llamadas HTTP para Incident
│   │
│   └── repositories/               # Implementaciones de repositorios
│       ├── AssigneeRepository.ts
│       └── IncidentRepository.ts
│
├── presentation/                   # 🎨 CAPA DE PRESENTACIÓN (UI)
│   ├── components/                 # Componentes React
│   │   ├── IncidentList.tsx
│   │   ├── IncidentForm.tsx
│   │   └── AssigneeSelector.tsx
│   │
│   ├── pages/                      # Páginas/vistas
│   │   ├── incidents/
│   │   └── assignees/
│   │
│   └── hooks/                      # Custom hooks
│       ├── useIncidents.ts
│       ├── useAssignees.ts
│       └── useIncidentPermissions.ts
│
└── shared/                         # 🔧 COMPARTIDO
    ├── types/                      # Tipos compartidos
    └── utils/                      # Utilidades
```

---

## 🎯 Flujo de Dependencias

```
Presentación → Aplicación → Dominio
     ↓              ↓
Infraestructura → Dominio
```

**Regla de oro**: Las capas externas dependen de las internas, NUNCA al revés.

---

## 📦 Capa 1: Dominio (core/domain/)

**Propósito**: Modelos de negocio puros, sin dependencias externas.

### Ejemplo: `Assignee.ts`
```typescript
import { AssigneeRoles } from "./AssigneeRoles"

export class Assignee {
    constructor(
        public id: number,
        public name: string,
        public role: AssigneeRoles,
        public isActive: boolean,
        public createdAt: Date,
        public updatedAt: Date
    ) {}

    // 🎯 Lógica de negocio en el modelo
    canAssignIncidents(): boolean {
        return this.role === AssigneeRoles.ADMIN || 
               this.role === AssigneeRoles.SUPPORT;
    }

    canDeleteIncidents(): boolean {
        return this.role === AssigneeRoles.ADMIN;
    }

    activate(): void {
        this.isActive = true;
        this.updatedAt = new Date();
    }
}
```

### Servicios de Dominio: `IncidentAssignmentValidator.ts`
```typescript
export class IncidentAssignmentValidator {
    canAssign(assigner: Assignee, target: Assignee): boolean {
        // Lógica de negocio compleja
        if (!assigner.isActive) return false;
        if (!assigner.canAssignIncidents()) return false;
        return true;
    }
}
```

---

## 📦 Capa 2: Aplicación (application/)

**Propósito**: Orquestar el flujo de datos entre UI e infraestructura.

### DTOs: `IncidentDTO.ts`
```typescript
// Representa la estructura que viene del backend
export interface IncidentDTO {
    id: number;
    title: string;
    description: string;
    status: string;
    assigneeId?: number;
    createdAt: string; // Backend envía string ISO
    updatedAt: string;
}
```

### Servicios de Aplicación: `IncidentService.ts`
```typescript
import { IncidentDTO } from "../dto/IncidentDTO";
import { Incident } from "../../core/domain/Incident";
import { IncidentRepository } from "../../infrastructure/repositories/IncidentRepository";

export class IncidentService {
    constructor(private repository: IncidentRepository) {}

    async getAllIncidents(): Promise<Incident[]> {
        // 1. Obtener datos del repositorio
        const dtos = await this.repository.findAll();
        
        // 2. Convertir DTOs a modelos de dominio
        return dtos.map(dto => this.toDomain(dto));
    }

    async createIncident(data: { title: string, description: string }): Promise<Incident> {
        const dto = await this.repository.create(data);
        return this.toDomain(dto);
    }

    // 🔄 Mapper: DTO → Domain
    private toDomain(dto: IncidentDTO): Incident {
        return new Incident(
            dto.id,
            dto.title,
            dto.description,
            dto.status as IncidentStatus,
            dto.assigneeId,
            new Date(dto.createdAt),
            new Date(dto.updatedAt)
        );
    }
}
```

---

## 📦 Capa 3: Infraestructura (infrastructure/)

**Propósito**: Comunicación con el mundo exterior (APIs, localStorage, etc.)

### Repositorio: `IncidentRepository.ts`
```typescript
import { IncidentDTO } from "../../application/dto/IncidentDTO";
import { IncidentApiAdapter } from "../api/IncidentApiAdapter";

export class IncidentRepository {
    private api = new IncidentApiAdapter();

    async findAll(): Promise<IncidentDTO[]> {
        return this.api.get("/api/incidents");
    }

    async findById(id: number): Promise<IncidentDTO> {
        return this.api.get(`/api/incidents/${id}`);
    }

    async create(data: any): Promise<IncidentDTO> {
        return this.api.post("/api/incidents", data);
    }

    async update(id: number, data: any): Promise<IncidentDTO> {
        return this.api.put(`/api/incidents/${id}`, data);
    }

    async delete(id: number, userId: number): Promise<void> {
        return this.api.delete(`/api/incidents/${id}`, {
            headers: { "X-User-Id": userId.toString() }
        });
    }
}
```

### Adaptador API: `IncidentApiAdapter.ts`
```typescript
const API_BASE_URL = "http://localhost:8080";

export class IncidentApiAdapter {
    async get<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error("Error fetching data");
        return response.json();
    }

    async post<T>(endpoint: string, data: any): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Error creating resource");
        return response.json();
    }

    async put<T>(endpoint: string, data: any): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Error updating resource");
        return response.json();
    }

    async delete(endpoint: string, options?: RequestInit): Promise<void> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "DELETE",
            ...options
        });
        if (!response.ok) throw new Error("Error deleting resource");
    }
}
```

---

## 📦 Capa 4: Presentación (presentation/)

**Propósito**: Componentes React que usan los servicios.

### Custom Hook: `useIncidents.ts`
```typescript
import { useState, useEffect } from "react";
import { Incident } from "../../core/domain/Incident";
import { IncidentService } from "../../application/services/IncidentService";
import { IncidentRepository } from "../../infrastructure/repositories/IncidentRepository";

export function useIncidents() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(false);
    
    // 🔧 Inyección de dependencias simple
    const service = new IncidentService(new IncidentRepository());

    useEffect(() => {
        loadIncidents();
    }, []);

    const loadIncidents = async () => {
        setLoading(true);
        try {
            const data = await service.getAllIncidents();
            setIncidents(data);
        } catch (error) {
            console.error("Error loading incidents", error);
        } finally {
            setLoading(false);
        }
    };

    const createIncident = async (data: { title: string, description: string }) => {
        const newIncident = await service.createIncident(data);
        setIncidents([...incidents, newIncident]);
    };

    return { incidents, loading, createIncident, refetch: loadIncidents };
}
```

### Componente: `IncidentList.tsx`
```typescript
import { useIncidents } from "../../hooks/useIncidents";
import { useIncidentPermissions } from "../../hooks/useIncidentPermissions";

export function IncidentList() {
    const { incidents, loading } = useIncidents();
    const currentUser = null; // Obtener del contexto
    const { canDeleteIncidents } = useIncidentPermissions(currentUser);

    if (loading) return <div>Cargando...</div>;

    return (
        <div>
            {incidents.map(incident => (
                <div key={incident.id}>
                    <h3>{incident.title}</h3>
                    <p>{incident.description}</p>
                    
                    {/* 🎯 Lógica de negocio del dominio */}
                    {incident.canBeEdited() && <button>Editar</button>}
                    
                    {/* 🔒 Permisos de usuario */}
                    {canDeleteIncidents && <button>Eliminar</button>}
                </div>
            ))}
        </div>
    );
}
```

---

## 🎯 Resumen de Responsabilidades

| Capa | Responsabilidad | Ejemplo |
|------|----------------|---------|
| **Dominio** | Modelos + reglas de negocio | `incident.canBeEdited()` |
| **Aplicación** | Orquestar + convertir DTOs | `service.getAllIncidents()` |
| **Infraestructura** | Comunicación externa | `repository.findAll()` |
| **Presentación** | UI + user interaction | `<IncidentList />` |

---

## ✅ Ventajas de esta arquitectura

1. **Testeable**: Cada capa se prueba independientemente
2. **Mantenible**: Cambios en UI no afectan la lógica de negocio
3. **Escalable**: Fácil agregar nuevas funcionalidades
4. **Reutilizable**: La lógica de dominio sirve para web, mobile, etc.
5. **Clara**: Cada archivo tiene un propósito específico

---

## 🚀 Próximos pasos

1. Crea las carpetas de la estructura
2. Implementa los modelos de dominio (`Assignee`, `Incident`)
3. Crea los servicios de aplicación
4. Implementa los adaptadores de API
5. Conecta todo con custom hooks
6. Usa los hooks en tus componentes React

---

## 💡 Tips

- ✅ Mantén el dominio **puro** (sin fetch, sin React)
- ✅ Los DTOs son **solo para transporte** de datos
- ✅ Los servicios de aplicación **orquestan**, no tienen lógica de negocio
- ✅ Los hooks React **solo conectan** la UI con los servicios
- ✅ La lógica de negocio está en **modelos de dominio** y **servicios de dominio**
