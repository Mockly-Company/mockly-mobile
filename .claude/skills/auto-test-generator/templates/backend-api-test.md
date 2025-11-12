# API 엔드포인트 테스트 템플릿

## 기본 구조 (Express/NestJS)

```typescript
import request from 'supertest';
import { app } from '../app';

describe('API Endpoint Tests', () => {
  // 테스트 케이스들
});
```

## 필수 테스트 케이스

### 1. GET 요청 테스트

```typescript
describe('GET /api/resource', () => {
  it('should return all resources', async () => {
    const response = await request(app).get('/api/resource').expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should return resource by id', async () => {
    const response = await request(app).get('/api/resource/1').expect(200);

    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('name');
  });

  it('should return 404 for non-existent resource', async () => {
    const response = await request(app).get('/api/resource/999999').expect(404);

    expect(response.body).toHaveProperty('error');
  });
});
```

### 2. POST 요청 테스트

```typescript
describe('POST /api/resource', () => {
  it('should create new resource', async () => {
    const newResource = {
      name: 'Test Resource',
      description: 'Test Description',
    };

    const response = await request(app).post('/api/resource').send(newResource).expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newResource.name);
    expect(response.body.description).toBe(newResource.description);
  });

  it('should validate required fields', async () => {
    const response = await request(app).post('/api/resource').send({}).expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('required');
  });

  it('should validate data types', async () => {
    const response = await request(app)
      .post('/api/resource')
      .send({ name: 123 }) // name should be string
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  it('should handle duplicate entries', async () => {
    const resource = { name: 'Unique Name' };

    // First creation should succeed
    await request(app).post('/api/resource').send(resource).expect(201);

    // Second creation with same name should fail
    const response = await request(app).post('/api/resource').send(resource).expect(409);

    expect(response.body.error).toContain('already exists');
  });
});
```

### 3. PUT/PATCH 요청 테스트

```typescript
describe('PUT /api/resource/:id', () => {
  it('should update existing resource', async () => {
    const updates = {
      name: 'Updated Name',
      description: 'Updated Description',
    };

    const response = await request(app).put('/api/resource/1').send(updates).expect(200);

    expect(response.body.name).toBe(updates.name);
    expect(response.body.description).toBe(updates.description);
  });

  it('should return 404 for non-existent resource', async () => {
    await request(app).put('/api/resource/999999').send({ name: 'Test' }).expect(404);
  });

  it('should validate update data', async () => {
    const response = await request(app)
      .put('/api/resource/1')
      .send({ name: '' }) // Invalid empty name
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });
});

describe('PATCH /api/resource/:id', () => {
  it('should partially update resource', async () => {
    const response = await request(app)
      .patch('/api/resource/1')
      .send({ name: 'New Name' })
      .expect(200);

    expect(response.body.name).toBe('New Name');
  });
});
```

### 4. DELETE 요청 테스트

```typescript
describe('DELETE /api/resource/:id', () => {
  it('should delete resource', async () => {
    await request(app).delete('/api/resource/1').expect(204);

    // Verify deletion
    await request(app).get('/api/resource/1').expect(404);
  });

  it('should return 404 for non-existent resource', async () => {
    await request(app).delete('/api/resource/999999').expect(404);
  });

  it('should handle cascading deletes', async () => {
    // Delete parent
    await request(app).delete('/api/parent/1').expect(204);

    // Verify children are also deleted
    const response = await request(app).get('/api/parent/1/children').expect(200);

    expect(response.body).toHaveLength(0);
  });
});
```

## 인증/인가 테스트

### 1. 인증 필요한 엔드포인트

```typescript
describe('Authentication', () => {
  it('should return 401 without token', async () => {
    await request(app).get('/api/protected').expect(401);
  });

  it('should return 401 with invalid token', async () => {
    await request(app)
      .get('/api/protected')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
  });

  it('should allow access with valid token', async () => {
    const token = 'valid-jwt-token';

    const response = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toBeDefined();
  });
});
```

### 2. 권한 확인 테스트

```typescript
describe('Authorization', () => {
  it('should allow admin to access admin routes', async () => {
    const adminToken = 'admin-jwt-token';

    await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('should deny regular user access to admin routes', async () => {
    const userToken = 'user-jwt-token';

    await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('should allow users to access own resources only', async () => {
    const userToken = 'user1-jwt-token';

    // Should succeed
    await request(app)
      .get('/api/users/1/profile')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    // Should fail
    await request(app)
      .get('/api/users/2/profile')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });
});
```

## 쿼리 파라미터 테스트

```typescript
describe('Query Parameters', () => {
  it('should filter by query params', async () => {
    const response = await request(app)
      .get('/api/resource')
      .query({ status: 'active' })
      .expect(200);

    expect(response.body.every(r => r.status === 'active')).toBe(true);
  });

  it('should paginate results', async () => {
    const response = await request(app)
      .get('/api/resource')
      .query({ page: 1, limit: 10 })
      .expect(200);

    expect(response.body.items).toHaveLength(10);
    expect(response.body).toHaveProperty('totalPages');
    expect(response.body).toHaveProperty('currentPage', 1);
  });

  it('should sort results', async () => {
    const response = await request(app)
      .get('/api/resource')
      .query({ sort: 'name', order: 'asc' })
      .expect(200);

    const names = response.body.map(r => r.name);
    const sortedNames = [...names].sort();
    expect(names).toEqual(sortedNames);
  });

  it('should search by keyword', async () => {
    const response = await request(app).get('/api/resource').query({ search: 'test' }).expect(200);

    expect(
      response.body.every(r => r.name.includes('test') || r.description.includes('test'))
    ).toBe(true);
  });
});
```

## 에러 처리 테스트

```typescript
describe('Error Handling', () => {
  it('should handle database errors', async () => {
    // Mock database failure
    jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('DB Error'));

    const response = await request(app).get('/api/resource').expect(500);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('Internal Server Error');
  });

  it('should handle validation errors', async () => {
    const response = await request(app)
      .post('/api/resource')
      .send({ email: 'invalid-email' })
      .expect(400);

    expect(response.body.error).toContain('invalid email');
  });

  it('should not expose sensitive error details', async () => {
    const response = await request(app).get('/api/resource/invalid').expect(400);

    expect(response.body.error).not.toContain('stack');
    expect(response.body.error).not.toContain('SQL');
  });
});
```

## 파일 업로드 테스트

```typescript
describe('File Upload', () => {
  it('should upload file successfully', async () => {
    const response = await request(app)
      .post('/api/upload')
      .attach('file', Buffer.from('file content'), 'test.txt')
      .expect(201);

    expect(response.body).toHaveProperty('fileUrl');
  });

  it('should validate file type', async () => {
    await request(app)
      .post('/api/upload')
      .attach('file', Buffer.from('content'), 'test.exe')
      .expect(400);
  });

  it('should validate file size', async () => {
    const largeBuffer = Buffer.alloc(10 * 1024 * 1024); // 10MB

    await request(app).post('/api/upload').attach('file', largeBuffer, 'large.txt').expect(413);
  });
});
```

## Setup & Teardown

```typescript
beforeAll(async () => {
  // Test DB 연결
  await connectTestDatabase();
});

afterAll(async () => {
  // Test DB 종료
  await closeTestDatabase();
});

beforeEach(async () => {
  // 각 테스트 전 DB 초기화
  await seedTestData();
});

afterEach(async () => {
  // 각 테스트 후 DB 정리
  await clearTestData();
  jest.clearAllMocks();
});
```
