import {
  createApplicationSchema,
  idParamSchema,
  listApplicationsQuerySchema,
  updateApplicationSchema,
} from './applicationValidators';

describe('createApplicationSchema', () => {
  const validInput = {
    company_name: 'Acme Corp',
    job_title: 'Frontend Engineer',
    job_type: 'Full-time',
    status: 'Applied',
    applied_date: '2024-06-01',
    notes: 'Referred by a friend',
  };

  it('accepts a fully valid payload', () => {
    expect(createApplicationSchema.safeParse(validInput).success).toBe(true);
  });

  it('accepts a valid payload without notes (optional field)', () => {
    const { notes, ...withoutNotes } = validInput;
    expect(createApplicationSchema.safeParse(withoutNotes).success).toBe(true);
  });

  it('rejects a company_name shorter than 2 characters', () => {
    const result = createApplicationSchema.safeParse({ ...validInput, company_name: 'A' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.company_name).toContain(
        'company_name must be at least 2 characters'
      );
    }
  });

  it('rejects a missing job_title', () => {
    const { job_title, ...withoutJobTitle } = validInput;
    expect(createApplicationSchema.safeParse(withoutJobTitle).success).toBe(false);
  });

  it('rejects an invalid job_type enum value', () => {
    expect(createApplicationSchema.safeParse({ ...validInput, job_type: 'Contractor' }).success).toBe(false);
  });

  it('rejects an invalid status enum value', () => {
    expect(createApplicationSchema.safeParse({ ...validInput, status: 'Ghosted' }).success).toBe(false);
  });

  it('rejects an unparseable applied_date', () => {
    expect(createApplicationSchema.safeParse({ ...validInput, applied_date: 'not-a-date' }).success).toBe(false);
  });

  it('rejects unknown extra fields (strict mode)', () => {
    expect(createApplicationSchema.safeParse({ ...validInput, salary: 100000 }).success).toBe(false);
  });

  it('trims whitespace from company_name and job_title', () => {
    const result = createApplicationSchema.safeParse({
      ...validInput,
      company_name: '  Acme Corp  ',
      job_title: '  Frontend Engineer  ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.company_name).toBe('Acme Corp');
      expect(result.data.job_title).toBe('Frontend Engineer');
    }
  });
});

describe('updateApplicationSchema', () => {
  it('accepts a single-field partial update', () => {
    expect(updateApplicationSchema.safeParse({ status: 'Offer' }).success).toBe(true);
  });

  it('rejects an empty object (no fields to update)', () => {
    expect(updateApplicationSchema.safeParse({}).success).toBe(false);
  });

  it('rejects an invalid enum value even on partial update', () => {
    expect(updateApplicationSchema.safeParse({ status: 'Pending' }).success).toBe(false);
  });

  it('allows notes to be explicitly cleared with null', () => {
    expect(updateApplicationSchema.safeParse({ notes: null }).success).toBe(true);
  });
});

describe('listApplicationsQuerySchema', () => {
  it('applies default page and pageSize when omitted', () => {
    const result = listApplicationsQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.pageSize).toBe(10);
    }
  });

  it('coerces string query params (page, pageSize) into numbers', () => {
    const result = listApplicationsQuerySchema.safeParse({ page: '3', pageSize: '25' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
      expect(result.data.pageSize).toBe(25);
    }
  });

  it('rejects a pageSize above the maximum allowed value', () => {
    expect(listApplicationsQuerySchema.safeParse({ pageSize: '500' }).success).toBe(false);
  });

  it('accepts an empty string status as "no filter"', () => {
    expect(listApplicationsQuerySchema.safeParse({ status: '' }).success).toBe(true);
  });

  it('rejects an invalid status filter value', () => {
    expect(listApplicationsQuerySchema.safeParse({ status: 'NotAStatus' }).success).toBe(false);
  });
});

describe('idParamSchema', () => {
  it('accepts a valid UUID', () => {
    expect(idParamSchema.safeParse({ id: '123e4567-e89b-12d3-a456-426614174000' }).success).toBe(true);
  });

  it('rejects a non-UUID string', () => {
    expect(idParamSchema.safeParse({ id: 'not-a-uuid' }).success).toBe(false);
  });
});