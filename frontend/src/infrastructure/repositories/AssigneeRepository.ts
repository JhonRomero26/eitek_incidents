import type { AssigneeDTO } from "../../application/dto/AssigneeDTO";
import { ApiClient } from "../api/ApiClient";

/**
 * DTO para crear un nuevo assignee
 * Solo contiene los campos que el backend espera
 */
interface CreateAssigneeRequest {
    name: string;
    role: string;
}

/**
 * DTO para actualizar un assignee existente
 * Solo contiene los campos que el backend espera
 */
interface UpdateAssigneeRequest {
    name?: string;
    role?: string;
}

export class AssigneeRepository {
    private api: ApiClient;

    constructor() {
        this.api = new ApiClient();
    }

    async findAll(): Promise<AssigneeDTO[]> {
        return this.api.get<AssigneeDTO[]>("/api/assignees");
    }

    async findActive(): Promise<AssigneeDTO[]> {
        return this.api.get<AssigneeDTO[]>("/api/assignees/active");
    }

    async findById(id: number): Promise<AssigneeDTO> {
        return this.api.get<AssigneeDTO>(`/api/assignees/${id}`);
    }

    async create(data: CreateAssigneeRequest): Promise<AssigneeDTO> {
        const payload: CreateAssigneeRequest = {
            name: data.name,
            role: data.role
        };
        return this.api.post<AssigneeDTO>("/api/assignees", payload);
    }

    async update(id: number, data: UpdateAssigneeRequest): Promise<AssigneeDTO> {
        const payload: UpdateAssigneeRequest = {};
        if (data.name !== undefined) payload.name = data.name;
        if (data.role !== undefined) payload.role = data.role;
        
        return this.api.put<AssigneeDTO>(`/api/assignees/${id}`, payload);
    }

    async activate(id: number): Promise<AssigneeDTO> {
        return this.api.put<AssigneeDTO>(`/api/assignees/${id}/activate`, null);
    }

    async deactivate(id: number): Promise<AssigneeDTO> {
        return this.api.put<AssigneeDTO>(`/api/assignees/${id}/deactivate`, null);
    }

    async delete(id: number, userId: number): Promise<void> {
        await this.api.delete(`/api/assignees/${id}`, {
            "X-User-Id": userId.toString(),
        });
    }
}
