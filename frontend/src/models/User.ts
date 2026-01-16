export interface User {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserUpdate {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
}
