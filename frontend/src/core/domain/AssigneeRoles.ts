export enum AssigneeRoles {
    ADMIN= "ADMIN",
    SUPPORT= "SUPPORT",
    TECHNICAL= "TECHNICAL",
    OPERATOR= "OPERATOR",
    USER= "USER"
}

export type AssigneeRolesType = keyof typeof AssigneeRoles;