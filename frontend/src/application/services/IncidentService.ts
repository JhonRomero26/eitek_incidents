import type { IncidentDTO } from "../dto/IncidentDTO";
import { Incident } from "../../core/domain/Incidents";
import { Assignee } from "../../core/domain/Assignee";
import { AssigneeRoles } from "../../core/domain/AssigneeRoles";
import { IncidentRepository } from "../../infrastructure/repositories/IncidentRepository";

export class IncidentService {
    private repository: IncidentRepository;

    constructor() {
        this.repository = new IncidentRepository();
    }

    async getAllIncidents(): Promise<Incident[]> {
        const dtos = await this.repository.findAll();
        return dtos.map(dto => this.toDomain(dto));
    }

    async getIncidentById(id: number): Promise<Incident> {
        const dto = await this.repository.findById(id);
        return this.toDomain(dto);
    }

    async createIncident(data: { 
        title: string; 
        description: string;
        status?: string;
    }): Promise<Incident> {
        const dto = await this.repository.create(data);
        return this.toDomain(dto);
    }

    async updateIncident(
        id: number, 
        data: { 
            title?: string; 
            description?: string;
            status?: string;
            assigneeId?: number;
            assignerId?: number;
        }
    ): Promise<Incident> {
        const dto = await this.repository.update(id, data);
        return this.toDomain(dto);
    }

    async deleteIncident(id: number, userId: number): Promise<void> {
        await this.repository.delete(id, userId);
    }

    private toDomain(dto: IncidentDTO): Incident {
        return new Incident({
            id: dto.id,
            title: dto.title,
            description: dto.description,
            assigneeId: dto.assigneeId,
            assignee: dto.assignee ? new Assignee({
                id: dto.assignee.id,
                name: dto.assignee.name,
                role: dto.assignee.role as AssigneeRoles,
                isActive: dto.assignee.isActive,
                createdAt: new Date(dto.assignee.createdAt),
                updatedAt: new Date(dto.assignee.updatedAt)
            }) : null,
            status: dto.status as any,
            createdAt: new Date(dto.createdAt),
            updatedAt: new Date(dto.updatedAt)
        });
    }
}
