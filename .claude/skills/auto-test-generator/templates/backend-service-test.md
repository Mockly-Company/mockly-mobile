# Service 레이어 테스트 템플릿

## 기본 구조

```typescript
import { ServiceName } from './ServiceName';
import { Repository } from './Repository';

jest.mock('./Repository');

describe('ServiceName', () => {
  let service: ServiceName;
  let mockRepository: jest.Mocked<Repository>;

  beforeEach(() => {
    mockRepository = new Repository() as jest.Mocked<Repository>;
    service = new ServiceName(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // 테스트 케이스들
});
```

## 필수 테스트 케이스

### 1. 데이터 조회 테스트

```typescript
describe('getData', () => {
  it('should return all data', async () => {
    const mockData = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];

    mockRepository.findAll.mockResolvedValue(mockData);

    const result = await service.getData();

    expect(result).toEqual(mockData);
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return data by id', async () => {
    const mockData = { id: 1, name: 'Item 1' };

    mockRepository.findById.mockResolvedValue(mockData);

    const result = await service.getDataById(1);

    expect(result).toEqual(mockData);
    expect(mockRepository.findById).toHaveBeenCalledWith(1);
  });

  it('should throw error when data not found', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(service.getDataById(999)).rejects.toThrow('Data not found');
  });
});
```

### 2. 데이터 생성 테스트

```typescript
describe('createData', () => {
  it('should create new data', async () => {
    const input = { name: 'New Item' };
    const created = { id: 1, ...input };

    mockRepository.create.mockResolvedValue(created);

    const result = await service.createData(input);

    expect(result).toEqual(created);
    expect(mockRepository.create).toHaveBeenCalledWith(input);
  });

  it('should validate input before creation', async () => {
    const invalidInput = { name: '' };

    await expect(service.createData(invalidInput)).rejects.toThrow('Name is required');

    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it('should handle duplicate data', async () => {
    const input = { name: 'Duplicate' };

    mockRepository.findByName.mockResolvedValue({ id: 1, name: 'Duplicate' });

    await expect(service.createData(input)).rejects.toThrow('Data already exists');
  });
});
```

### 3. 데이터 업데이트 테스트

```typescript
describe('updateData', () => {
  it('should update existing data', async () => {
    const existing = { id: 1, name: 'Old Name' };
    const updates = { name: 'New Name' };
    const updated = { id: 1, name: 'New Name' };

    mockRepository.findById.mockResolvedValue(existing);
    mockRepository.update.mockResolvedValue(updated);

    const result = await service.updateData(1, updates);

    expect(result).toEqual(updated);
    expect(mockRepository.update).toHaveBeenCalledWith(1, updates);
  });

  it('should throw error when updating non-existent data', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(service.updateData(999, { name: 'Test' })).rejects.toThrow('Data not found');
  });

  it('should validate updates', async () => {
    const existing = { id: 1, name: 'Name' };

    mockRepository.findById.mockResolvedValue(existing);

    await expect(service.updateData(1, { name: '' })).rejects.toThrow('Invalid name');
  });
});
```

### 4. 데이터 삭제 테스트

```typescript
describe('deleteData', () => {
  it('should delete existing data', async () => {
    const existing = { id: 1, name: 'Item' };

    mockRepository.findById.mockResolvedValue(existing);
    mockRepository.delete.mockResolvedValue(true);

    await service.deleteData(1);

    expect(mockRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw error when deleting non-existent data', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(service.deleteData(999)).rejects.toThrow('Data not found');
  });

  it('should handle cascading deletes', async () => {
    const parent = { id: 1, name: 'Parent' };

    mockRepository.findById.mockResolvedValue(parent);
    mockRepository.delete.mockResolvedValue(true);
    mockRepository.deleteRelated.mockResolvedValue(true);

    await service.deleteData(1);

    expect(mockRepository.delete).toHaveBeenCalledWith(1);
    expect(mockRepository.deleteRelated).toHaveBeenCalledWith(1);
  });
});
```

## 비즈니스 로직 테스트

### 복잡한 비즈니스 로직

```typescript
describe('processOrder', () => {
  it('should process order successfully', async () => {
    const order = {
      userId: 1,
      items: [{ productId: 1, quantity: 2, price: 10 }],
    };

    mockRepository.getUser.mockResolvedValue({ id: 1, balance: 100 });
    mockRepository.getProduct.mockResolvedValue({ id: 1, stock: 10 });
    mockRepository.createOrder.mockResolvedValue({ id: 1, ...order });
    mockRepository.updateUserBalance.mockResolvedValue(true);
    mockRepository.updateProductStock.mockResolvedValue(true);

    const result = await service.processOrder(order);

    expect(result.id).toBe(1);
    expect(mockRepository.updateUserBalance).toHaveBeenCalledWith(1, 80);
    expect(mockRepository.updateProductStock).toHaveBeenCalledWith(1, 8);
  });

  it('should reject order with insufficient balance', async () => {
    const order = {
      userId: 1,
      items: [{ productId: 1, quantity: 2, price: 100 }],
    };

    mockRepository.getUser.mockResolvedValue({ id: 1, balance: 50 });

    await expect(service.processOrder(order)).rejects.toThrow('Insufficient balance');

    expect(mockRepository.createOrder).not.toHaveBeenCalled();
  });

  it('should reject order with insufficient stock', async () => {
    const order = {
      userId: 1,
      items: [{ productId: 1, quantity: 10, price: 10 }],
    };

    mockRepository.getUser.mockResolvedValue({ id: 1, balance: 1000 });
    mockRepository.getProduct.mockResolvedValue({ id: 1, stock: 5 });

    await expect(service.processOrder(order)).rejects.toThrow('Insufficient stock');
  });
});
```

### 트랜잭션 처리 테스트

```typescript
describe('transferFunds', () => {
  it('should transfer funds between accounts', async () => {
    const fromAccount = { id: 1, balance: 100 };
    const toAccount = { id: 2, balance: 50 };

    mockRepository.getAccount.mockResolvedValueOnce(fromAccount);
    mockRepository.getAccount.mockResolvedValueOnce(toAccount);
    mockRepository.updateBalance.mockResolvedValue(true);

    await service.transferFunds(1, 2, 30);

    expect(mockRepository.updateBalance).toHaveBeenCalledWith(1, 70);
    expect(mockRepository.updateBalance).toHaveBeenCalledWith(2, 80);
  });

  it('should rollback on failure', async () => {
    mockRepository.getAccount.mockResolvedValue({ id: 1, balance: 100 });
    mockRepository.updateBalance.mockRejectedValueOnce(new Error('DB Error'));

    await expect(service.transferFunds(1, 2, 30)).rejects.toThrow('DB Error');

    // Verify rollback was attempted
    expect(mockRepository.rollback).toHaveBeenCalled();
  });
});
```

## 외부 서비스 통합 테스트

### API 호출 테스트

```typescript
describe('fetchExternalData', () => {
  it('should fetch data from external API', async () => {
    const mockResponse = { data: 'external data' };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await service.fetchExternalData();

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/data');
  });

  it('should handle API errors', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    await expect(service.fetchExternalData()).rejects.toThrow('External API error');
  });

  it('should retry on failure', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'success' }),
      } as Response);

    const result = await service.fetchExternalData();

    expect(result).toEqual({ data: 'success' });
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });
});
```

### 이메일/메시지 발송 테스트

```typescript
describe('sendNotification', () => {
  let mockEmailService: jest.Mocked<EmailService>;

  beforeEach(() => {
    mockEmailService = {
      send: jest.fn().mockResolvedValue(true),
    } as any;
    service = new ServiceName(mockRepository, mockEmailService);
  });

  it('should send email notification', async () => {
    const user = { id: 1, email: 'user@example.com' };

    mockRepository.findById.mockResolvedValue(user);

    await service.sendNotification(1, 'Test message');

    expect(mockEmailService.send).toHaveBeenCalledWith({
      to: 'user@example.com',
      subject: 'Notification',
      body: 'Test message',
    });
  });

  it('should handle email sending failures gracefully', async () => {
    mockEmailService.send.mockRejectedValue(new Error('SMTP Error'));

    // Should not throw, but log error
    await service.sendNotification(1, 'Test');

    expect(mockRepository.logError).toHaveBeenCalled();
  });
});
```

## 캐싱 테스트

```typescript
describe('caching', () => {
  let mockCache: jest.Mocked<CacheService>;

  beforeEach(() => {
    mockCache = {
      get: jest.fn(),
      set: jest.fn(),
    } as any;
    service = new ServiceName(mockRepository, mockCache);
  });

  it('should return cached data if available', async () => {
    const cachedData = { id: 1, name: 'Cached' };

    mockCache.get.mockResolvedValue(cachedData);

    const result = await service.getData(1);

    expect(result).toEqual(cachedData);
    expect(mockRepository.findById).not.toHaveBeenCalled();
  });

  it('should fetch and cache data if not cached', async () => {
    const freshData = { id: 1, name: 'Fresh' };

    mockCache.get.mockResolvedValue(null);
    mockRepository.findById.mockResolvedValue(freshData);

    const result = await service.getData(1);

    expect(result).toEqual(freshData);
    expect(mockCache.set).toHaveBeenCalledWith('data:1', freshData);
  });

  it('should invalidate cache on update', async () => {
    mockCache.delete = jest.fn();

    await service.updateData(1, { name: 'Updated' });

    expect(mockCache.delete).toHaveBeenCalledWith('data:1');
  });
});
```

## 에러 처리 테스트

```typescript
describe('error handling', () => {
  it('should handle database connection errors', async () => {
    mockRepository.findAll.mockRejectedValue(new Error('Connection timeout'));

    await expect(service.getData()).rejects.toThrow('Connection timeout');
  });

  it('should log errors', async () => {
    const mockLogger = jest.spyOn(console, 'error').mockImplementation();

    mockRepository.findById.mockRejectedValue(new Error('DB Error'));

    await expect(service.getDataById(1)).rejects.toThrow();

    expect(mockLogger).toHaveBeenCalled();

    mockLogger.mockRestore();
  });

  it('should wrap errors with custom error types', async () => {
    mockRepository.findById.mockRejectedValue(new Error('DB Error'));

    await expect(service.getDataById(1)).rejects.toThrow(ServiceError);
  });
});
```

## 권한 확인 테스트

```typescript
describe('authorization', () => {
  it('should allow owner to access resource', async () => {
    const resource = { id: 1, ownerId: 1 };

    mockRepository.findById.mockResolvedValue(resource);

    const result = await service.getResource(1, { userId: 1 });

    expect(result).toEqual(resource);
  });

  it('should deny non-owner access to resource', async () => {
    const resource = { id: 1, ownerId: 1 };

    mockRepository.findById.mockResolvedValue(resource);

    await expect(service.getResource(1, { userId: 2 })).rejects.toThrow('Access denied');
  });

  it('should allow admin to access any resource', async () => {
    const resource = { id: 1, ownerId: 1 };

    mockRepository.findById.mockResolvedValue(resource);

    const result = await service.getResource(1, { userId: 2, role: 'admin' });

    expect(result).toEqual(resource);
  });
});
```
