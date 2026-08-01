import { Collection, Db, Document, MongoClient } from 'mongodb';

let client: MongoClient | null = null;
let database: Db | null = null;

const mongoUri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/job_tracker';

export const connectToDatabase = async (): Promise<Db> => {
  if (database) {
    return database;
  }

  client = new MongoClient(mongoUri);
  await client.connect();
  database = client.db();
  return database;
};

export const getDatabase = async (): Promise<Db> => {
  if (!database) {
    return connectToDatabase();
  }

  return database;
};

export const getApplicationsCollection = async (): Promise<Collection<Document>> => {
  const db = await getDatabase();
  return db.collection('applications');
};

export const checkDatabaseConnection = async (): Promise<void> => {
  const db = await connectToDatabase();
  await db.command({ ping: 1 });
};

export const closeDatabaseConnection = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    database = null;
  }
};
