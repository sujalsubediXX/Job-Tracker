import { z } from 'zod';
import { APPLICATION_STATUSES, JOB_TYPES } from '../types/application';

export const applicationFormSchema = z.object({
    company_name: z.string().trim().min(2, 'Company name must be at least 2 characters').max(200, 'Company name must be at most 200 characters'),
    job_title: z.string().trim().min(1, 'Job title is required').max(200, 'Job title must be at most 200 characters'),
    job_type: z.enum(JOB_TYPES, { errorMap: () => ({ message: 'Select a job type' }) }),
    status: z.enum(APPLICATION_STATUSES, { errorMap: () => ({ message: 'Select a status' }) }),
    applied_date: z.string().min(1, 'Applied date is required').refine((value) => !Number.isNaN(new Date(value).getTime()), 'Enter a valid date'),
    notes: z.string().max(5000, 'Notes must be at most 5000 characters'),
});

export type ApplicationFormSchema = z.infer<typeof applicationFormSchema>;