import { ApiClient, ApiClientConfig } from './client';

export { ApiClient, type ApiClientConfig } from './client';

let _apiClient: ApiClient | null = null;

export function initializeApiClient(config: ApiClientConfig): void {
  _apiClient = new ApiClient(config);
}

export const apiClient = new Proxy({} as ApiClient, {
  get(_target, prop) {
    if (!_apiClient) {
      throw new Error('ApiClient not initialized. Call initializeApiClient first.');
    }
    return _apiClient[prop as keyof ApiClient];
  },
});
