import { Router } from 'express';
import {
  createApplication,
  deleteApplication,
  getApplication,
  listApplications,
  updateApplication,
} from '../controllers/applicationController';
import { asyncHandler, validate } from '../middleware';
import {
  createApplicationSchema,
  idParamSchema,
  listApplicationsQuerySchema,
  updateApplicationSchema,
} from '../validators/applicationValidators';

export const applicationRouter = Router();

applicationRouter.get('/', validate(listApplicationsQuerySchema, 'query'), asyncHandler(listApplications));
applicationRouter.get('/:id', validate(idParamSchema, 'params'), asyncHandler(getApplication));
applicationRouter.post('/', validate(createApplicationSchema, 'body'), asyncHandler(createApplication));
applicationRouter.patch(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateApplicationSchema, 'body'),
  asyncHandler(updateApplication)
);
applicationRouter.delete('/:id', validate(idParamSchema, 'params'), asyncHandler(deleteApplication));