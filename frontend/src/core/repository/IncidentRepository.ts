import type { Incident } from "../domain/Incidents"

export interface IncidentRepository {
    getAll(): Promise<Incident[]>
    getById(id: number): Promise<Incident | null>
    save(incident: Omit<Incident, "id" | "createdAt" | "updatedAt">): Promise<void>
    update(id: number, incident: Partial<Incident>): Promise<void>
    delete(id: number): Promise<void>
}