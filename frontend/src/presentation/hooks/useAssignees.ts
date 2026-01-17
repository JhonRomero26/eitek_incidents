import { useState, useEffect, useCallback } from "react";
import { Assignee } from "../../core/domain/Assignee";
import { AssigneeService } from "../../application/services/AssigneeService";

export function useAssignees() {
    const [assignees, setAssignees] = useState<Assignee[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const service = new AssigneeService();

    const loadAssignees = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await service.getAllAssignees();
            setAssignees(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error loading assignees");
            console.error("Error loading assignees:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAssignees();
    }, [loadAssignees]);

    const loadActiveAssignees = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await service.getActiveAssignees();
            setAssignees(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error loading active assignees");
            console.error("Error loading active assignees:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createAssignee = async (data: { 
        name: string; 
        role: string;
    }) => {
        try {
            const newAssignee = await service.createAssignee(data);
            await loadAssignees();
            return newAssignee;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error creating assignee");
            throw err;
        }
    };

    const updateAssignee = async (
        id: number, 
        data: { 
            name?: string; 
            role?: string;
        }
    ) => {
        try {
            const updated = await service.updateAssignee(id, data);
            await loadAssignees();
            return updated;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error updating assignee");
            throw err;
        }
    };

    const activateAssignee = async (id: number) => {
        try {
            const updated = await service.activateAssignee(id);
            // Actualizar en el estado local
            setAssignees(assignees.map(a => a.id === id ? updated : a));
            // Recargar para asegurar sincronización
            await loadAssignees();
            return updated;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error activating assignee");
            throw err;
        }
    };

    const deactivateAssignee = async (id: number) => {
        try {
            const updated = await service.deactivateAssignee(id);
            // Actualizar en el estado local
            setAssignees(assignees.map(a => a.id === id ? updated : a));
            // Recargar para asegurar sincronización
            await loadAssignees();
            return updated;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error deactivating assignee");
            throw err;
        }
    };

    const deleteAssignee = async (id: number, userId: number) => {
        try {
            await service.deleteAssignee(id, userId);
            await loadAssignees();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error deleting assignee");
            throw err;
        }
    };

    return {
        assignees,
        loading,
        error,
        createAssignee,
        updateAssignee,
        activateAssignee,
        deactivateAssignee,
        deleteAssignee,
        loadAssignees,
        refetch: loadAssignees,
        loadActiveAssignees,
    };
}
