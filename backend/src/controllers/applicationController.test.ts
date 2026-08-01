import request from 'supertest';
import { createApp } from '../app';
import { ApplicationRow } from '../types/application';

jest.mock('../repositories/applicationRepository', () => ({
  applicationRepository: {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const { applicationRepository } = jest.requireMock('../repositories/applicationRepository');

const sampleApplication: ApplicationRow = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  company_name: 'Acme Corp',
  job_title: 'Frontend Engineer',
  job_type: 'Full-time',
  status: 'Applied',
  applied_date: '2024-06-01',
  notes: null,
  created_at: '2024-06-01T00:00:00.000Z',
  updated_at: '2024-06-01T00:00:00.000Z',
};

const app = createApp();

describe('GET /applications', () => {
  it('returns a paginated list of applications', async () => {
    applicationRepository.findAll.mockResolvedValue({
      data: [sampleApplication],
      meta: { page: 1, pageSize: 10, totalItems: 1, totalPages: 1 },
    });
    const response = await request(app).get('/applications');
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].company_name).toBe('Acme Corp');
    expect(response.body.meta.totalItems).toBe(1);
  });

  it('rejects an invalid status filter with a 422', async () => {
    const response = await request(app).get('/applications').query({ status: 'NotReal' });
    expect(response.status).toBe(422);
  });
});

describe('GET /applications/:id', () => {
  it('returns 404 when the application does not exist', async () => {
    applicationRepository.findById.mockResolvedValue(null);
    const response = await request(app).get(`/applications/${sampleApplication.id}`);
    expect(response.status).toBe(404);
  });

  it('returns 400 (validation) for a malformed id', async () => {
    const response = await request(app).get('/applications/not-a-uuid');
    expect(response.status).toBe(422);
  });

  it('returns the application when found', async () => {
    applicationRepository.findById.mockResolvedValue(sampleApplication);
    const response = await request(app).get(`/applications/${sampleApplication.id}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(sampleApplication.id);
  });
});

describe('POST /applications', () => {
  it('creates an application and returns 201', async () => {
    applicationRepository.create.mockResolvedValue(sampleApplication);
    const response = await request(app).post('/applications').send({
      company_name: 'Acme Corp',
      job_title: 'Frontend Engineer',
      job_type: 'Full-time',
      status: 'Applied',
      applied_date: '2024-06-01',
    });
    expect(response.status).toBe(201);
    expect(applicationRepository.create).toHaveBeenCalledTimes(1);
  });

  it('rejects a payload missing required fields with a 422', async () => {
    const response = await request(app).post('/applications').send({ company_name: 'Acme Corp' });
    expect(response.status).toBe(422);
    expect(applicationRepository.create).not.toHaveBeenCalled();
  });

  it('rejects a company_name that is too short', async () => {
    const response = await request(app).post('/applications').send({
      company_name: 'A',
      job_title: 'Engineer',
      job_type: 'Full-time',
      status: 'Applied',
      applied_date: '2024-06-01',
    });
    expect(response.status).toBe(422);
  });
});

describe('PATCH /applications/:id', () => {
  it('returns 404 when updating an application that does not exist', async () => {
    applicationRepository.findById.mockResolvedValue(null);
    const response = await request(app).patch(`/applications/${sampleApplication.id}`).send({ status: 'Offer' });
    expect(response.status).toBe(404);
  });

  it('updates and returns the application when it exists', async () => {
    applicationRepository.findById.mockResolvedValue(sampleApplication);
    applicationRepository.update.mockResolvedValue({ ...sampleApplication, status: 'Offer' });
    const response = await request(app).patch(`/applications/${sampleApplication.id}`).send({ status: 'Offer' });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Offer');
  });
});

describe('DELETE /applications/:id', () => {
  it('returns 204 when deletion succeeds', async () => {
    applicationRepository.delete.mockResolvedValue(true);
    const response = await request(app).delete(`/applications/${sampleApplication.id}`);
    expect(response.status).toBe(204);
  });

  it('returns 404 when the application does not exist', async () => {
    applicationRepository.delete.mockResolvedValue(false);
    const response = await request(app).delete(`/applications/${sampleApplication.id}`);
    expect(response.status).toBe(404);
  });
});