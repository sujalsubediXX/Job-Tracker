import { Request, Response } from 'express';
import { applicationRepository } from '../repositories/applicationRepository';
import { NotFoundError } from '../utils/errors';
import { CreateApplicationDto, ListApplicationsQueryDto, UpdateApplicationDto } from '../validators/applicationValidators';

export const listApplications = async (req: Request, res: Response): Promise<void> => {
  const query = req.query as unknown as ListApplicationsQueryDto;
  const result = await applicationRepository.findAll({
    status: query.status === '' ? undefined : query.status,
    search: query.search,
    page: query.page,
    pageSize: query.pageSize,
  });
  res.status(200).json(result);
};

export const getApplication = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  const application = await applicationRepository.findById(id);
  if (!application) {
    throw new NotFoundError(`Application with id ${id} not found`);
  }
  res.status(200).json(application);
};

export const createApplication = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as CreateApplicationDto;
  const application = await applicationRepository.create({
    ...body,
    notes: body.notes ?? null,
  });
  res.status(201).json(application);
};

export const updateApplication = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  const body = req.body as UpdateApplicationDto;

  const existing = await applicationRepository.findById(id);
  if (!existing) {
    throw new NotFoundError(`Application with id ${id} not found`);
  }

  const updated = await applicationRepository.update(id, body);
  res.status(200).json(updated);
};

export const deleteApplication = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  const deleted = await applicationRepository.delete(id);
  if (!deleted) {
    throw new NotFoundError(`Application with id ${id} not found`);
  }
  res.status(204).send();
};