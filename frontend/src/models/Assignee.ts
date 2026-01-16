export interface Assignee {
    id: number;
    userId: number;
    roleId: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AssigneeUpdate {
    userId?: number;
    roleId?: number;
    isActive?: boolean;
}