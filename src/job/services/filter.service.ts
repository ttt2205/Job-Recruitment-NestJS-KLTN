import { JobQueryDto } from '../dtos/job-query.dto';

export abstract class FilterService {
  abstract filterJobsByCompanyIdForDashboard(
    id: string | number,
    queryPagination: JobQueryDto,
  );
}
