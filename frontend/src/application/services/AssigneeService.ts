import { Assignee } from "../../core/domain/Assignee";
import { AssigneeRoles } from "../../core/domain/AssigneeRoles";
import type { AssigneeDTO } from "../dto/AssigneeDTO";
import { AssigneeRepository } from "../../infrastructure/repositories/AssigneeRepository";

export class AssigneeService {
    private repository: AssigneeRepository;

    constructor() {
        this.repository = new AssigneeRepository();
    }

    async getAllAssignees(): Promise<Assignee[]> {
        const dtos = await this.repository.findAll();
        return dtos.map(dto => this.toDomain(dto));
    }

    async getActiveAssignees(): Promise<Assignee[]> {
        const dtos = await this.repository.findActive();
        return dtos.map(dto => this.toDomain(dto));
    }

    async getAssigneeById(id: number): Promise<Assignee> {
        const dto = await this.repository.findById(id);
        return this.toDomain(dto);
    }

    async createAssignee(data: { 
        name: string; 
        role: string;
    }): Promise<Assignee> {
        const dto = await this.repository.create({
            name: data.name,
            role: data.role
        });
        return this.toDomain(dto);
    }

    async updateAssignee(
        id: number, 
        data: { 
            name?: string; 
            role?: string;
        }
    ): Promise<Assignee> {
        const dto = await this.repository.update(id, {
            name: data.name,
            role: data.role
        });
        return this.toDomain(dto);
    }

    async activateAssignee(id: number): Promise<Assignee> {
        const dto = await this.repository.activate(id);
        return this.toDomain(dto);
    }

    async deactivateAssignee(id: number): Promise<Assignee> {
        const dto = await this.repository.deactivate(id);
        return this.toDomain(dto);
    }

    async deleteAssignee(id: number, userId: number): Promise<void> {
        await this.repository.delete(id, userId);
    }

    private toDomain(dto: AssigneeDTO): Assignee {
        return new Assignee({
            id: dto.id,
            name: dto.name,
            role: dto.role as AssigneeRoles,
            isActive: dto.isActive,
            createdAt: new Date(dto.createdAt),
            updatedAt: new Date(dto.updatedAt)
        });
    }

    toDTO(assignee: Assignee): AssigneeDTO {
        return {
            id: assignee.id,
            name: assignee.name,
            role: assignee.role,
            isActive: assignee.isActive,
            createdAt: assignee.createdAt.toISOString(),
            updatedAt: assignee.updatedAt.toISOString()
        };
    }
}