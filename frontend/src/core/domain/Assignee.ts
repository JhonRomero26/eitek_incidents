import { AssigneeRoles } from "./AssigneeRoles"

export class Assignee {
    id: number
    name: string
    role: AssigneeRoles
    isActive: boolean
    initials: string
    createdAt: Date
    updatedAt: Date

    constructor({
        id,
        name,
        role,
        isActive,
        createdAt,
        updatedAt
    }: {
        id: number
        name: string
        role: AssigneeRoles
        isActive: boolean
        createdAt: Date
        updatedAt: Date
    }) {
        this.id = id
        this.name = name || ""
        this.role = role || AssigneeRoles.USER
        this.isActive = isActive || true
        this.createdAt = createdAt || new Date()
        this.updatedAt = updatedAt || new Date()
        this.initials = this.computeInitials()
    }

    canAssignIncidents(): boolean {
        return this.role === AssigneeRoles.ADMIN || this.role === AssigneeRoles.SUPPORT;
    }

    canAssignToRole(_targetRole: AssigneeRoles): boolean {
        if (!this.canAssignIncidents()) {
            return false;
        }
        return true;
    }

    canDeleteIncidents(): boolean {
        return this.role === AssigneeRoles.ADMIN;
    }

    computeInitials(): string {
        const names = this.name.trim().split(" ");
        if (names.length === 0) return "";
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }

    activate(): void {
        this.isActive = true;
        this.updatedAt = new Date();
    }

    deactivate(): void {
        this.isActive = false;
        this.updatedAt = new Date();
    }
}