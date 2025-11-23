export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  expiresAt: Date;
}

export interface AccessRefreshToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}
