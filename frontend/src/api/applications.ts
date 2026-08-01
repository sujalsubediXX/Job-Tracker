import { apiClient } from './client';
import { Application, ApplicationFormValues, ApplicationsQuery, PaginatedApplications } from '../types/application';

const toCreatePayload = (values: ApplicationFormValues) => ({
  company_name: values.company_name.trim(),
  job_title: values.job_title.trim(),
  job_type: values.job_type,
  status: values.status,
  applied_date: values.applied_date,
  notes: values.notes.trim() === '' ? null : values.notes.trim(),
});

export const fetchApplications = async (query: ApplicationsQuery): Promise<PaginatedApplications> => {
  const response = await apiClient.get<PaginatedApplications>('/applications', {
    params: {
      status: query.status || undefined,
      search: query.search || undefined,
      page: query.page,
      pageSize: query.pageSize,
    },
  });
  return response.data;
};

export const fetchApplication = async (id: string): Promise<Application> => {
  const response = await apiClient.get<Application>(`/applications/${id}`);
  return response.data;
};

export const createApplication = async (values: ApplicationFormValues): Promise<Application> => {
  const response = await apiClient.post<Application>('/applications', toCreatePayload(values));
  return response.data;
};

export const updateApplication = async (
  id: string,
  values: Partial<ApplicationFormValues>
): Promise<Application> => {
  const payload: Record<string, unknown> = { ...values };
  if (typeof values.notes === 'string') {
    payload.notes = values.notes.trim() === '' ? null : values.notes.trim();
  }
  const response = await apiClient.patch<Application>(`/applications/${id}`, payload);
  return response.data;
};

export const deleteApplication = async (id: string): Promise<void> => {
  await apiClient.delete(`/applications/${id}`);
};