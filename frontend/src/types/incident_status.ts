export enum IncidentStatusEnum {
    OPEN = 'OPEN',
    ASSIGNED = 'ASSIGNED',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED'
}

export type IncidentStatus = keyof typeof IncidentStatusEnum;