export const JOB_TYPES = ['Internship', 'Full-time', 'Part-time'] as const;
export type JobType = (typeof JOB_TYPES)[number];

export const APPLICATION_STATUSES = ['Applied', 'Interviewing', 'Offer', 'Rejected'] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface Application {
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

export interface ApplicationFormValues {
  company_name: string;
  job_title: string;
  job_type: JobType;
  status: ApplicationStatus;
  applied_date: string;
  notes: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedApplications {
  data: Application[];
  meta: PaginationMeta;
}

export interface ApplicationsQuery {
  status?: ApplicationStatus | '';
  search?: string;
  page?: number;
  pageSize?: number;
}

export type StatusCounts = Record<ApplicationStatus, number>;