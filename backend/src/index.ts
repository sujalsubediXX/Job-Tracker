import dotenv from 'dotenv';

dotenv.config();

import { createApp } from './app';
import { checkDatabaseConnection } from './db/mongo';

const PORT = Number(process.env.PORT ?? 4000);

const start = async (): Promise<void> => {
  try {
    await checkDatabaseConnection();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB. Make sure MongoDB is running and MONGODB_URI is configured.', err);
    process.exit(1);
  }

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Job tracker API listening on http://localhost:${PORT}`);
  });
};

start();