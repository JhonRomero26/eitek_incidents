import type { IncidentDTO } from "../../application/dto/IncidentDTO";
import { ApiClient } from "../api/ApiClient";

export class IncidentRepository {
    private api: ApiClient;

    constructor() {
        this.api = new ApiClient();
    }

    async findAll(): Promise<IncidentDTO[]> {
        return this.api.get<IncidentDTO[]>("/api/incidents");
    }

    async findById(id: number): Promise<IncidentDTO> {
        return this.api.get<IncidentDTO>(`/api/incidents/${id}`);
    }

    async create(data: any): Promise<IncidentDTO> {
        return this.api.post<IncidentDTO>("/api/incidents", data);
    }

    async update(id: number, data: any): Promise<IncidentDTO> {
        return this.api.put<IncidentDTO>(`/api/incidents/${id}`, data);
    }

    async delete(id: number, userId: number): Promise<void> {
        return this.api.delete(`/api/incidents/${id}`, {
            "X-User-Id": userId.toString(),
        });
    }
}
