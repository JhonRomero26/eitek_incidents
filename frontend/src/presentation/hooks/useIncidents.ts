import { useState, useEffect, useCallback } from "react";
import { Incident } from "../../core/domain/Incidents";
import { IncidentService } from "../../application/services/IncidentService";

export function useIncidents() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const service = new IncidentService();

    const loadIncidents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await service.getAllIncidents();
            // Ordenar por fecha de creación (más recientes primero)
            const sortedData = data.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setIncidents(sortedData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error loading incidents");
            console.error("Error loading incidents:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadIncidents();
    }, [loadIncidents]);

    const createIncident = async (data: { 
        title: string; 
        description: string;
        status?: string;
    }) => {
        try {
            const newIncident = await service.createIncident(data);
            const updatedIncidents = [newIncident, ...incidents].sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setIncidents(updatedIncidents);
            return newIncident;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error creating incident");
            throw err;
        }
    };

    const updateIncident = async (
        id: number, 
        data: { 
            title?: string; 
            description?: string;
            status?: string;
            assigneeId?: number;
            assignerId?: number;
        }
    ) => {
        try {
            const updated = await service.updateIncident(id, data);
            const updatedIncidents = incidents.map(inc => inc.id === id ? updated : inc).sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setIncidents(updatedIncidents);
            return updated;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error updating incident");
            throw err;
        }
    };

    const deleteIncident = async (id: number, userId?: number) => {
        try {
            await service.deleteIncident(id, userId || 0);
            setIncidents(incidents.filter(inc => inc.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error deleting incident");
            throw err;
        }
    };

    const assignIncident = async (incidentId: number, assigneeId: number, assignerId?: number) => {
        try {
            const updated = await service.updateIncident(incidentId, { 
                assigneeId,
                assignerId,
                status: "ASSIGNED"
            });
            const updatedIncidents = incidents.map(inc => inc.id === incidentId ? updated : inc).sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setIncidents(updatedIncidents);
            return updated;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error assigning incident");
            throw err;
        }
    };

    return {
        incidents,
        loading,
        error,
        createIncident,
        updateIncident,
        deleteIncident,
        assignIncident,
        loadIncidents,
        refetch: loadIncidents,
    };
}
