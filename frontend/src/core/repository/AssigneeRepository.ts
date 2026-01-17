import type { Assignee } from "../domain/Assignee"

export interface AssigneeRepository {
    getAll(): Promise<Assignee[]>
    getById(id: number): Promise<Assignee | null>
    getActiveAssignees(): Promise<Assignee[]>
    save(Assignee: Assignee): Promise<void>
    update(id: number, Assignee: Partial<Assignee>): Promise<void>
    updateRole(id: number, role: string): Promise<void>
    delete(id: number): Promise<void>
}