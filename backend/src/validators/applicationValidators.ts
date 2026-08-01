import { z } from 'zod';
import { APPLICATION_STATUSES, JOB_TYPES } from '../types/application';

const dateStringSchema = z
  .string({ required_error: 'applied_date is required' })
  .min(1, 'applied_date is required')
  .refine((value) => !Number.isNaN(new Date(value).getTime()), {
    message: 'applied_date must be a valid date (YYYY-MM-DD)',
  });

const companyNameSchema = z
  .string({ required_error: 'company_name is required' })
  .trim()
  .min(2, 'company_name must be at least 2 characters')
  .max(200, 'company_name must be at most 200 characters');

const jobTitleSchema = z
  .string({ required_error: 'job_title is required' })
  .trim()
  .min(1, 'job_title is required')
  .max(200, 'job_title must be at most 200 characters');

const jobTypeSchema = z.enum(JOB_TYPES, {
  errorMap: () => ({ message: `job_type must be one of: ${JOB_TYPES.join(', ')}` }),
});

const statusSchema = z.enum(APPLICATION_STATUSES, {
  errorMap: () => ({ message: `status must be one of: ${APPLICATION_STATUSES.join(', ')}` }),
});

const notesSchema = z.string().max(5000, 'notes must be at most 5000 characters').nullable().optional();

export const createApplicationSchema = z
  .object({
    company_name: companyNameSchema,
    job_title: jobTitleSchema,
    job_type: jobTypeSchema,
    status: statusSchema,
    applied_date: dateStringSchema,
    notes: notesSchema,
  })
  .strict();

export const updateApplicationSchema = z
  .object({
    company_name: companyNameSchema.optional(),
    job_title: jobTitleSchema.optional(),
    job_type: jobTypeSchema.optional(),
    status: statusSchema.optional(),
    applied_date: dateStringSchema.optional(),
    notes: notesSchema,
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update an application',
  });

export const listApplicationsQuerySchema = z.object({
  status: z.union([statusSchema, z.literal('')]).optional(),
  search: z.string().trim().max(200).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export const idParamSchema = z.object({
  id: z.string().uuid('id must be a valid UUID'),
});

export type CreateApplicationDto = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationDto = z.infer<typeof updateApplicationSchema>;
export type ListApplicationsQueryDto = z.infer<typeof listApplicationsQuerySchema>;