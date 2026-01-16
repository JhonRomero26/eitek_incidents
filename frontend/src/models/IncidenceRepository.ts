export interface IncidenceRepository {
    id: number;
    name: string;
    description: string;
    assigneeId: number;
    status: 'open' | 'in_progress' | 'resolved' | 'canceled' | 'closed';
    tagIds: number[];
    createdAt: string;
    updatedAt: string;
}