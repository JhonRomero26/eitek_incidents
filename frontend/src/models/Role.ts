export interface Role {
    id: number;
    name: string;
    code: string;
    createdAt: string;
    updatedAt: string;
}

export interface RoleUpdate {
    name?: string;
    code?: string;
}