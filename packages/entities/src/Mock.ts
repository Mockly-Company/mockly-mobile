export interface Mock {
  id: string;
  title: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockData extends Mock {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  statusCode: number;
  responseBody: Record<string, unknown>;
  headers?: Record<string, string>;
}
