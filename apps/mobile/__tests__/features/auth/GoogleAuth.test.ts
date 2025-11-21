/**
 * Google Auth 서비스 단위 테스트
 * GoogleAuthService 클래스의 메서드 동작 검증
 */

import { authorize } from 'react-native-app-auth';
import { GoogleAuthService } from '@features/auth/services/GoogleAuthService';
import { auth } from '@mockly/api';

// react-native-app-auth 모킹
jest.mock('react-native-app-auth');

// @mockly/api 모킹
jest.mock('@mockly/api', () => ({
  auth: {
    loginGoogleCode: jest.fn(),
    refreshGoogleToken: jest.fn(),
    revokeGoogleToken: jest.fn(),
  },
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

    it('사용자 취소 시 null을 반환해야 함', async () => {
      mockAuthorize.mockRejectedValue(new Error('User cancelled'));

      const result = await googleAuthService.authorize();

      expect(result).toBeNull();
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

      (auth.loginGoogleCode as jest.Mock).mockResolvedValue(mockResponse);

      const result = await googleAuthService.exchangeCodeForToken(
        'mock-auth-code',
        'mock-code-verifier',
      );

      expect(result).toEqual(mockResponse);
      expect(auth.loginGoogleCode).toHaveBeenCalledWith({
        code: 'mock-auth-code',
        codeVerifier: 'mock-code-verifier',
        redirectUri: expect.any(String),
      });
    });

    it('네트워크 오류 시 null을 반환해야 함', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      (auth.loginGoogleCode as jest.Mock).mockRejectedValue(
        new Error('Network error'),
      );

      const result = await googleAuthService.exchangeCodeForToken(
        'mock-auth-code',
        'mock-code-verifier',
      );

      expect(result).toBeNull();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('refreshAccessToken', () => {
    it('토큰 갱신이 성공해야 함', async () => {
      const mockResponse = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresAt: new Date(Date.now() + 3600000),
      };

      (auth.refreshGoogleToken as jest.Mock).mockResolvedValue(mockResponse);

      const result =
        await googleAuthService.refreshAccessToken('mock-refresh-token');

      expect(result).toEqual(mockResponse);
      expect(auth.refreshGoogleToken).toHaveBeenCalledWith(
        'mock-refresh-token',
      );
    });

    it('토큰 갱신 실패 시 null을 반환해야 함', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      (auth.refreshGoogleToken as jest.Mock).mockRejectedValue(
        new Error('Refresh failed'),
      );

      const result =
        await googleAuthService.refreshAccessToken('mock-refresh-token');

      expect(result).toBeNull();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('revokeToken', () => {
    it('토큰 폐기가 성공해야 함', async () => {
      (auth.revokeGoogleToken as jest.Mock).mockResolvedValue(undefined);

      const result = await googleAuthService.revokeToken('mock-access-token');

      expect(result).toBe(true);
      expect(auth.revokeGoogleToken).toHaveBeenCalled();
    });

    it('토큰 폐기 실패 시 false를 반환해야 함', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      (auth.revokeGoogleToken as jest.Mock).mockRejectedValue(
        new Error('Revoke failed'),
      );

      const result = await googleAuthService.revokeToken('mock-access-token');

      expect(result).toBe(false);

      consoleErrorSpy.mockRestore();
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
