export class QueryStringBuilder {
  private params: URLSearchParams;
  private baseUrl: string;

  private constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.params = new URLSearchParams();
  }

  static create(baseUrl: string): QueryStringBuilder {
    return new QueryStringBuilder(baseUrl);
  }

  set(key: string, value: string | number | boolean | undefined | null): this {
    if (value !== undefined && value !== null) {
      this.params.set(key, String(value));
    }
    return this;
  }

  build(): string {
    const queryString = this.params.toString();
    return queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
  }
}
