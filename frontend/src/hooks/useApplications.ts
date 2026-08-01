import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createApplication,
  deleteApplication,
  fetchApplication,
  fetchApplications,
  updateApplication,
} from '../api/applications';
import {
  Application,
  ApplicationFormValues,
  ApplicationsQuery,
  APPLICATION_STATUSES,
  PaginatedApplications,
  StatusCounts,
} from '../types/application';

const APPLICATIONS_KEY = 'applications' as const;

export const applicationsKeys = {
  all: [APPLICATIONS_KEY] as const,
  list: (query: ApplicationsQuery) => [APPLICATIONS_KEY, 'list', query] as const,
  detail: (id: string) => [APPLICATIONS_KEY, 'detail', id] as const,
  counts: (search: string | undefined) => [APPLICATIONS_KEY, 'counts', search ?? ''] as const,
};

export const useApplicationsQuery = (query: ApplicationsQuery) =>
  useQuery({
    queryKey: applicationsKeys.list(query),
    queryFn: () => fetchApplications(query),
    placeholderData: (previous) => previous,
  });

export const useApplicationQuery = (id: string | undefined) =>
  useQuery({
    queryKey: applicationsKeys.detail(id ?? ''),
    queryFn: () => fetchApplication(id as string),
    enabled: Boolean(id),
  });

export const useStatusCountsQuery = (search: string | undefined) =>
  useQuery({
    queryKey: applicationsKeys.counts(search),
    queryFn: async (): Promise<StatusCounts> => {
      const results = await Promise.all(
        APPLICATION_STATUSES.map((status) => fetchApplications({ status, search, page: 1, pageSize: 1 }))
      );
      const counts = {} as StatusCounts;
      APPLICATION_STATUSES.forEach((status, index) => {
        counts[status] = results[index]?.meta.totalItems ?? 0;
      });
      return counts;
    },
  });

const invalidateApplicationLists = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: applicationsKeys.all });
};

export const useCreateApplicationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: ApplicationFormValues) => createApplication(values),
    onSuccess: () => invalidateApplicationLists(queryClient),
  });
};

interface UpdateContext {
  previousLists: Array<[readonly unknown[], PaginatedApplications | undefined]>;
  previousDetail: Application | undefined;
}

export const useUpdateApplicationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<ApplicationFormValues> }) =>
      updateApplication(id, values),
    onMutate: async ({ id, values }): Promise<UpdateContext> => {
      await queryClient.cancelQueries({ queryKey: applicationsKeys.all });

      const previousLists = queryClient.getQueriesData<PaginatedApplications>({
        queryKey: [APPLICATIONS_KEY, 'list'],
      });
      const previousDetail = queryClient.getQueryData<Application>(applicationsKeys.detail(id));

      const patch = (application: Application): Application => ({
        ...application,
        ...values,
        notes: values.notes !== undefined ? (values.notes.trim() === '' ? null : values.notes) : application.notes,
      });

      queryClient.setQueriesData<PaginatedApplications>({ queryKey: [APPLICATIONS_KEY, 'list'] }, (current) => {
        if (!current) return current;
        return {
          ...current,
          data: current.data.map((application) => (application.id === id ? patch(application) : application)),
        };
      });

      if (previousDetail) {
        queryClient.setQueryData<Application>(applicationsKeys.detail(id), patch(previousDetail));
      }

      return { previousLists, previousDetail };
    },
    onError: (_err, { id }, context) => {
      context?.previousLists.forEach(([key, value]) => queryClient.setQueryData(key, value));
      if (context?.previousDetail) {
        queryClient.setQueryData(applicationsKeys.detail(id), context.previousDetail);
      }
    },
    onSettled: () => invalidateApplicationLists(queryClient),
  });
};

interface DeleteContext {
  previousLists: Array<[readonly unknown[], PaginatedApplications | undefined]>;
}

export const useDeleteApplicationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteApplication(id),
    onMutate: async (id): Promise<DeleteContext> => {
      await queryClient.cancelQueries({ queryKey: applicationsKeys.all });

      const previousLists = queryClient.getQueriesData<PaginatedApplications>({
        queryKey: [APPLICATIONS_KEY, 'list'],
      });

      queryClient.setQueriesData<PaginatedApplications>({ queryKey: [APPLICATIONS_KEY, 'list'] }, (current) => {
        if (!current) return current;
        const data = current.data.filter((application) => application.id !== id);
        return { data, meta: { ...current.meta, totalItems: Math.max(0, current.meta.totalItems - 1) } };
      });

      return { previousLists };
    },
    onError: (_err, _id, context) => {
      context?.previousLists.forEach(([key, value]) => queryClient.setQueryData(key, value));
    },
    onSettled: () => invalidateApplicationLists(queryClient),
  });
};