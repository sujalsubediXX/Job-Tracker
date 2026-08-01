import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFoundHandler } from './middleware';
import { applicationRouter } from './routes/applicationRoutes';

export const createApp = (): Express => {
  const app = express();

  const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5174' )
    .split(',')
    .map((origin) => origin.trim());

  app.use(helmet());
  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json());

  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/applications', applicationRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};