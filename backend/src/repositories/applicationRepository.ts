import { randomUUID } from 'node:crypto';
import { Collection, Document, Filter } from 'mongodb';
import { getApplicationsCollection } from '../db/mongo';
import {
  ApplicationRow,
  CreateApplicationInput,
  ListApplicationsQuery,
  PaginatedResult,
  UpdateApplicationInput,
} from '../types/application';

const toApplicationRow = (doc: Document): ApplicationRow => ({
  id: String(doc.id ?? doc._id),
  company_name: doc.company_name,
  job_title: doc.job_title,
  job_type: doc.job_type,
  status: doc.status,
  applied_date: doc.applied_date,
  notes: doc.notes ?? null,
  created_at: doc.created_at,
  updated_at: doc.updated_at,
});

export class ApplicationRepository {
  constructor(private readonly collection: Collection<Document> | Promise<Collection<Document>> | null = null) {}

  private async getCollection(): Promise<Collection<Document>> {
    if (this.collection) {
      return this.collection instanceof Promise ? this.collection : this.collection;
    }

    return getApplicationsCollection();
  }

  async findAll(query: ListApplicationsQuery): Promise<PaginatedResult<ApplicationRow>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    const filter: Filter<Document> = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.search) {
      const search = query.search.toLowerCase();
      filter.$or = [
        { company_name: { $regex: search, $options: 'i' } },
        { job_title: { $regex: search, $options: 'i' } },
      ];
    }

    const collection = await this.getCollection();
    const [totalItems, documents] = await Promise.all([
      collection.countDocuments(filter),
      collection.find(filter).sort({ applied_date: -1, created_at: -1 }).skip(skip).limit(pageSize).toArray(),
    ]);

    return {
      data: documents.map(toApplicationRow),
      meta: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
      },
    };
  }

  async findById(id: string): Promise<ApplicationRow | null> {
    const collection = await this.getCollection();
    const document = await collection.findOne({ id });
    return document ? toApplicationRow(document) : null;
  }

  async create(input: CreateApplicationInput): Promise<ApplicationRow> {
    const collection = await this.getCollection();
    const now = new Date().toISOString();
    const id = randomUUID();
    const document = {
      id,
      company_name: input.company_name,
      job_title: input.job_title,
      job_type: input.job_type,
      status: input.status,
      applied_date: input.applied_date,
      notes: input.notes ?? null,
      created_at: now,
      updated_at: now,
    };

    await collection.insertOne(document);
    return toApplicationRow(document);
  }

  async update(id: string, input: UpdateApplicationInput): Promise<ApplicationRow | null> {
    const entries = Object.entries(input).filter(([, value]) => value !== undefined);
    if (entries.length === 0) {
      return this.findById(id);
    }

    const collection = await this.getCollection();
    const update = {
      $set: {
        ...Object.fromEntries(entries),
        updated_at: new Date().toISOString(),
      },
    };

    const result = await collection.findOneAndUpdate(
      { id },
      update,
      { returnDocument: 'after' }
    );

    return result ? toApplicationRow(result) : null;
  }

  async delete(id: string): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }
}

export const applicationRepository = new ApplicationRepository();