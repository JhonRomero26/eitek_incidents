import { IncidentStatus, type IncidentStatusType } from "./IncidentStatus"
import type { Assignee } from "./Assignee"

export class Incident {
    id: number
    title: string
    description: string
    assigneeId?: number | null
    assignee?: Assignee | null
    status: IncidentStatusType
    createdAt: Date
    updatedAt: Date

    constructor({
        id,
        title,
        description,
        assigneeId,
        assignee,
        status,
        createdAt,
        updatedAt
    }: {
        id: number
        title: string
        description: string
        assigneeId?: number | null
        assignee?: Assignee | null
        status: IncidentStatusType
        createdAt: Date
        updatedAt: Date
    }) {
        this.id = id
        this.title = title || ""
        this.description = description || ""
        this.assigneeId = assigneeId || null
        this.assignee = assignee || null
        this.status = status || IncidentStatus.OPEN
        this.createdAt = createdAt || new Date()
        this.updatedAt = updatedAt || new Date()
    }

    /**
     * Verifica si el incidente está asignado a alguien
     */
    isAssigned(): boolean {
        return this.assigneeId !== null && this.assigneeId !== undefined;
    }

    /**
     * Verifica si el incidente está abierto (sin asignar)
     */
    isOpen(): boolean {
        return this.status === IncidentStatus.OPEN;
    }

    /**
     * Verifica si el incidente está en progreso
     */
    isInProgress(): boolean {
        return this.status === IncidentStatus.IN_PROGRESS;
    }

    /**
     * Verifica si el incidente está resuelto
     */
    isResolved(): boolean {
        return this.status === IncidentStatus.RESOLVED;
    }

    /**
     * Verifica si el incidente puede ser editado
     * Los incidentes resueltos normalmente no se editan
     */
    canBeEdited(): boolean {
        return !this.isResolved();
    }
}