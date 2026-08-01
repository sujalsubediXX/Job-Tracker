import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { AppError } from '../utils/errors';

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };

type RequestPart = 'body' | 'query' | 'params';

export const validate =
  (schema: ZodSchema, part: RequestPart = 'body'): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      const formatted = result.error.flatten();
      next(
        new AppError('Validation failed', 422, {
          fieldErrors: formatted.fieldErrors,
          formErrors: formatted.formErrors,
        })
      );
      return;
    }
    (req[part] as unknown) = result.data;
    next();
  };

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: { message: err.message, details: err.details },
    });
    return;
  }

  if (err instanceof ZodError) {
    const formatted = err.flatten();
    res.status(422).json({
      error: {
        message: 'Validation failed',
        details: { fieldErrors: formatted.fieldErrors, formErrors: formatted.formErrors },
      },
    });
    return;
  }

  const maybePgError = err as { code?: string; message?: string };
  if (maybePgError?.code === '22P02') {
    res.status(400).json({ error: { message: 'Invalid identifier format' } });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ error: { message: 'Internal server error' } });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({ error: { message: `Route ${req.method} ${req.path} not found` } });
};