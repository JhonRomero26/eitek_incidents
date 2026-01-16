import type { IncidentStatus } from "@/types/incident_status";

export interface Incidence {
    id: number;
    name: string;
    description: string;
    assigneeId?: number;
    status: IncidentStatus;
    tags?: number[];
    createdAt: string;
    updatedAt: string;
}

export interface IncidenceUpdate {
    name?: string;
    description?: string;
    assigneeId?: number;
    status?: IncidentStatus;
    tags?: number[];
}