# Sistema de Autenticación

## 🔐 Implementación

Se ha implementado un sistema de autenticación simple usando **Zustand** y **localStorage**.

## 📁 Archivos creados

### 1. Store de Autenticación
**`src/shared/stores/authStore.ts`**
- Store global con Zustand
- Persistencia automática en localStorage
- Métodos: `setCurrentUser()`, `logout()`

### 2. Vista de Selección de Usuario
**`src/presentation/pages/SelectUserPage.tsx`**
- Muestra todos los assignees activos
- Click en un usuario → login automático
- Redirección a `/dashboard`

### 3. Hooks y Componentes
- **`useAuth.ts`** - Hook para acceder al usuario actual
- **`ProtectedRoute.tsx`** - Componente para proteger rutas
- **`UserProfile.tsx`** - Componente para mostrar info del usuario

## 🚀 Uso

### En cualquier componente:

\`\`\`tsx
import { useAuth } from "@/presentation/hooks/useAuth";
import { useIncidentPermissions } from "@/presentation/hooks/useIncidentPermissions";

function MyComponent() {
    const { currentUser, isAuthenticated, logout } = useAuth();
    const { canDeleteIncidents, canAssignIncidents } = useIncidentPermissions(currentUser);

    if (!isAuthenticated) {
        return <div>No autenticado</div>;
    }

    return (
        <div>
            <h1>Hola, {currentUser?.name}!</h1>
            <p>Rol: {currentUser?.role}</p>
            
            {canDeleteIncidents && <button>Eliminar</button>}
            {canAssignIncidents && <button>Asignar</button>}
            
            <button onClick={logout}>Cerrar sesión</button>
        </div>
    );
}
\`\`\`

### Proteger rutas:

\`\`\`tsx
import { ProtectedRoute } from "@/presentation/components/ProtectedRoute";

<Route path="/dashboard">
    <ProtectedRoute>
        <DashboardPage />
    </ProtectedRoute>
</Route>
\`\`\`

### Mostrar perfil del usuario:

\`\`\`tsx
import { UserProfile } from "@/presentation/components/UserProfile";

function Header() {
    return (
        <header>
            <h1>Mi App</h1>
            <UserProfile /> {/* Muestra usuario + botón logout */}
        </header>
    );
}
\`\`\`

## 📦 LocalStorage

Los datos se guardan automáticamente en localStorage con la key `auth-storage`:

\`\`\`json
{
    "state": {
        "currentUser": {
            "id": 1,
            "name": "Juan Pérez",
            "role": "ADMIN",
            "isActive": true,
            "createdAt": "2024-01-16T...",
            "updatedAt": "2024-01-16T..."
        },
        "isAuthenticated": true
    },
    "version": 0
}
\`\`\`

## 🎨 Características de la Vista

- ✅ Grid responsive (1-3 columnas según pantalla)
- ✅ Avatares con iniciales
- ✅ Badges de color según rol
- ✅ Indicadores de permisos (puede asignar/eliminar)
- ✅ Animaciones al hacer hover
- ✅ Feedback visual al seleccionar
- ✅ Solo muestra usuarios activos

## 🔄 Flujo de Autenticación

1. Usuario entra a `/` o `/select-user`
2. Ve lista de assignees activos
3. Hace click en uno
4. Se guarda en localStorage + Zustand store
5. Redirección a `/dashboard`
6. En rutas protegidas, verifica autenticación
7. Si no está autenticado → redirect a `/select-user`

## 🛠️ Integración con tu App

Actualiza tu `src/App.tsx`:

\`\`\`tsx
import { Route, Switch } from "wouter";
import { SelectUserPage } from "./presentation/pages/SelectUserPage";
import { ProtectedRoute } from "./presentation/components/ProtectedRoute";

function App() {
    return (
        <Switch>
            <Route path="/select-user" component={SelectUserPage} />
            
            <Route path="/dashboard">
                <ProtectedRoute>
                    <DashboardPage />
                </ProtectedRoute>
            </Route>

            <Route path="/" component={SelectUserPage} />
        </Switch>
    );
}
\`\`\`

## 💡 Tips

- El usuario persiste entre recargas de página (localStorage)
- Usa `useAuth()` en lugar de acceder directamente al store
- `currentUser` tiene todos los métodos del dominio (`canDeleteIncidents()`, etc.)
- `ProtectedRoute` redirige automáticamente si no hay sesión
