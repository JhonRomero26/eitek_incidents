import { Route, Switch, Redirect } from "wouter";
import { SelectUserPage } from "./presentation/pages/SelectUserPage";
import { ProtectedRoute } from "./presentation/components/ProtectedRoute";
import { ProtectedReselectUser } from "./presentation/components/ProtectedReselectUser";
import { DashboardLayout } from "./presentation/layout/dashboard-layout";
import { ToastContainer } from "./presentation/components/ui/toast";
import IncidentsPage from "./presentation/pages/incidents";
import IncidentDetailPage from "./presentation/pages/incidents/detail";
import AssigneesPage from "./presentation/pages/assignees";

function App() {
    return (
        <>
            <Switch>
                {/* Página de selección de usuario (simulación de login) */}
                <Route path="/">
                    <ProtectedReselectUser>
                        <SelectUserPage />
                    </ProtectedReselectUser>
                </Route>

                {/* Dashboard redirige a incidencias */}
                <Route path="/dashboard">
                    <Redirect to="/incidents" />
                </Route>

                {/* Lista de incidencias */}
                <Route path="/incidents">
                    <ProtectedRoute>
                        <DashboardLayout>
                            <IncidentsPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                </Route>

                {/* Detalle de incidencia */}
                <Route path="/incidents/:id">
                    <ProtectedRoute>
                        <DashboardLayout>
                            <IncidentDetailPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                </Route>

                {/* Lista de responsables */}
                <Route path="/assignees">
                    <ProtectedRoute>
                        <DashboardLayout>
                            <AssigneesPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                </Route>

            {/* Fallback */}
            <Route>
                <Redirect to="/" />
            </Route>
        </Switch>
        <ToastContainer />
        </>
    );
}

export default App;
