import { IncidentStatus } from "../../core/domain/IncidentStatus";
import type { AssigneeDTO } from "./AssigneeDTO";

export interface IncidentDTO {
    id: number;
    title: string;
    description: string;
    assigneeId?: number | null;
    assignee?: AssigneeDTO | null;
    status: IncidentStatus;
    createdAt: Date;
    updatedAt: Date;
}
