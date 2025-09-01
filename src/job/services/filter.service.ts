export abstract class FilterService {
    abstract filterJobsByCompanyIdForDashboard(id: string | number, category?: string, time?: number): Promise<any[]>;
}