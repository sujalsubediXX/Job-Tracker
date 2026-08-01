import { ApplicationRepository } from './applicationRepository';
import { CreateApplicationInput } from '../types/application';

describe('ApplicationRepository', () => {
  it('creates an application and maps the stored document to the API response shape', async () => {
    const insertOne = jest.fn().mockResolvedValue({ insertedId: 'app-123' });
    const collection = { insertOne } as any;
    const repository = new ApplicationRepository(collection);

    const input: CreateApplicationInput = {
      company_name: 'Acme Corp',
      job_title: 'Backend Engineer',
      job_type: 'Full-time',
      status: 'Applied',
      applied_date: '2024-06-01',
      notes: 'Need to follow up',
    };

    const result = await repository.create(input);

    expect(insertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        company_name: input.company_name,
        job_title: input.job_title,
        status: input.status,
      })
    );
    expect(result.id).toBeDefined();
    expect(result.company_name).toBe(input.company_name);
  });
});
