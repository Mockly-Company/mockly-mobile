/**
 * Google Auth 서비스 단위 테스트
 * GoogleAuthService 클래스의 메서드 동작 검증
 */

import { authorize } from 'react-native-app-auth';
import { GoogleAuthService } from '@features/auth/services/GoogleAuthService';
import * as api from '@mockly/api';

// react-native-app-auth 모킹
jest.mock('react-native-app-auth');

// 환경 변수 모킹
jest.mock('@env', () => ({
  GOOGLE_ANDROID_CLIENT_ID: 'mock-client-id',
  GOOGLE_REDIRECT_URI: 'com.mockly.app:/oauth2redirect',
}));

// @mockly/api 모킹
jest.mock('@mockly/api', () => ({
  loginGoogleCode: jest.fn(),
  refreshGoogleToken: jest.fn(),
  logout: jest.fn(),
}));

const mockAuthorize = authorize as jest.MockedFunction<typeof authorize>;

describe('GoogleAuthService 단위 테스트', () => {
  let googleAuthService: GoogleAuthService;

  beforeEach(() => {
    googleAuthService = new GoogleAuthService();
    jest.clearAllMocks();
  });

  describe('authorize', () => {
    it('Authorization Code와 Code Verifier를 반환해야 함', async () => {
      mockAuthorize.mockResolvedValue({
        authorizationCode: 'mock-auth-code',
        codeVerifier: 'mock-code-verifier',
        accessToken: '',
        accessTokenExpirationDate: '',
        tokenType: '',
        refreshToken: '',
        idToken: '',
        scopes: [],
        tokenAdditionalParameters: {},
        authorizeAdditionalParameters: {},
      });

      const result = await googleAuthService.authorize();

      expect(result).toEqual({
        authorizationCode: 'mock-auth-code',
        codeVerifier: 'mock-code-verifier',
      });
    });

    it('사용자 취소 시 AppError를 throw해야 함', async () => {
      mockAuthorize.mockRejectedValue(new Error('User cancelled'));

      await expect(googleAuthService.authorize()).rejects.toThrow();
    });
  });

  describe('exchangeCodeForToken', () => {
    it('백엔드에서 토큰을 받아야 함', async () => {
      const mockResponse = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
        },
        expiresAt: new Date(Date.now() + 3600000),
      };

      (api.loginGoogleCode as jest.Mock).mockResolvedValue(mockResponse);

      const result = await googleAuthService.exchangeCodeForToken(
        'mock-auth-code',
        'mock-code-verifier',
      );

      expect(result).toEqual(mockResponse);
      expect(api.loginGoogleCode).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'mock-auth-code',
          codeVerifier: 'mock-code-verifier',
        }),
      );
    });

    it('네트워크 오류 시 AppError를 throw해야 함', async () => {
      (api.loginGoogleCode as jest.Mock).mockRejectedValue(
        new Error('Network error'),
      );

      await expect(
        googleAuthService.exchangeCodeForToken(
          'mock-auth-code',
          'mock-code-verifier',
        ),
      ).rejects.toThrow();
    });
  });

  describe('refreshAccessToken', () => {
    it('토큰 갱신이 성공해야 함', async () => {
      const mockResponse = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresAt: new Date(Date.now() + 3600000),
      };

      (api.refreshGoogleToken as jest.Mock).mockResolvedValue(mockResponse);

      const result =
        await googleAuthService.refreshAccessToken('mock-refresh-token');

      expect(result).toEqual(mockResponse);
      expect(api.refreshGoogleToken).toHaveBeenCalledWith('mock-refresh-token');
    });

    it('토큰 갱신 실패 시 AppError를 throw해야 함', async () => {
      (api.refreshGoogleToken as jest.Mock).mockRejectedValue(
        new Error('Refresh failed'),
      );

      await expect(
        googleAuthService.refreshAccessToken('mock-refresh-token'),
      ).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('로그아웃이 성공해야 함', async () => {
      (api.logout as jest.Mock).mockResolvedValue(undefined);

      const result = await googleAuthService.logout('mock-access-token');

      expect(result).toBe(true);
      expect(api.logout).toHaveBeenCalled();
    });

    it('로그아웃 실패 시 AppError를 throw해야 함', async () => {
      (api.logout as jest.Mock).mockRejectedValue(new Error('Logout failed'));

      await expect(
        googleAuthService.logout('mock-access-token'),
      ).rejects.toThrow();
    });
  });

  describe('토큰 만료 검증', () => {
    it('만료된 토큰을 감지해야 함', () => {
      const expiredTime = Date.now() - 1000;
      expect(googleAuthService.isTokenExpired(expiredTime)).toBe(true);

      const validTime = Date.now() + 3600000;
      expect(googleAuthService.isTokenExpired(validTime)).toBe(false);
    });

    it('5분 이내 만료 예정 토큰을 감지해야 함', () => {
      const expiringTime = Date.now() + 4 * 60 * 1000;
      expect(googleAuthService.isTokenExpiringSoon(expiringTime)).toBe(true);

      const validTime = Date.now() + 10 * 60 * 1000;
      expect(googleAuthService.isTokenExpiringSoon(validTime)).toBe(false);
    });
  });
});
