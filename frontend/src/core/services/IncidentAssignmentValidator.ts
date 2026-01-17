import { Assignee } from "../domain/Assignee";
import { Incident } from "../domain/Incidents";

/**
 * Servicio de dominio que encapsula las reglas de negocio
 * para la asignación de incidentes en el frontend
 */
export class IncidentAssignmentValidator {
    /**
     * Valida si un assignee puede asignar un incidente a otro assignee
     * 
     * Reglas:
     * - Solo admin y support pueden asignar incidentes
     * - admin y support pueden asignar a cualquier rol
     * - Otros roles no pueden asignar incidentes
     * 
     * @param assigner El assignee que intenta hacer la asignación
     * @param targetAssignee El assignee al que se quiere asignar
     * @param incident La incidencia a asignar
     * @returns true si la asignación está permitida
     */
    canAssign(
        assigner: Assignee | null,
        targetAssignee: Assignee | null,
    ): boolean {
        if (!assigner) {
            return false;
        }

        if (!assigner.isActive) {
            return false;
        }

        if (!assigner.canAssignIncidents()) {
            return false;
        }

        if (targetAssignee && !targetAssignee.isActive) {
            return false;
        }
        return true;
    }

    /**
     * Valida si se puede auto-asignar una incidencia
     */
    canSelfAssign(assigner: Assignee | null, _incident: Incident): boolean {
        if (!assigner || !assigner.isActive) {
            return false;
        }
        return true;
    }
}
