export const JOB_TYPES = ['Internship', 'Full-time', 'Part-time'] as const;
export type JobType = (typeof JOB_TYPES)[number];

export const APPLICATION_STATUSES = ['Applied', 'Interviewing', 'Offer', 'Rejected'] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface ApplicationRow {
  id: string;
  company_name: string;
  job_title: string;
  job_type: JobType;
  status: ApplicationStatus;
  applied_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateApplicationInput {
  company_name: string;
  job_title: string;
  job_type: JobType;
  status: ApplicationStatus;
  applied_date: string;
  notes?: string | null;
}

export interface UpdateApplicationInput {
  company_name?: string;
  job_title?: string;
  job_type?: JobType;
  status?: ApplicationStatus;
  applied_date?: string;
  notes?: string | null;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ListApplicationsQuery {
  status?: ApplicationStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}