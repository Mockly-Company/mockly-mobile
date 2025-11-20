/**
 * Google Auth 서비스 단위 테스트
 * GoogleAuthService 클래스의 메서드 동작 검증
 */

import { authorize } from 'react-native-app-auth';
import { GoogleAuthService } from '@lib/app-auth/providers/GoogleAuthService';

// react-native-app-auth 모킹
jest.mock('react-native-app-auth');

const mockAuthorize = authorize as jest.MockedFunction<typeof authorize>;

// fetch 모킹
global.fetch = jest.fn() as jest.Mock;

describe('GoogleAuthService 단위 테스트', () => {
  let googleAuthService: GoogleAuthService;

  beforeEach(() => {
    googleAuthService = new GoogleAuthService();
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
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
        idToken: 'mock-id-token',
        expiresIn: 3600,
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await googleAuthService.exchangeCodeForToken(
        'mock-auth-code',
        'mock-code-verifier',
      );

      expect(result).toEqual(mockResponse);
    });

    it('네트워크 오류 시 null을 반환해야 함', async () => {
      // console.error 스파이 설정
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await googleAuthService.exchangeCodeForToken(
        'mock-auth-code',
        'mock-code-verifier',
      );

      expect(result).toBeNull();

      // 복원
      consoleErrorSpy.mockRestore();
    });
  });

  describe('decodeIdToken', () => {
    it('ID Token에서 사용자 정보를 추출해야 함', () => {
      const mockPayload = {
        sub: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/photo.jpg',
        email_verified: true,
      };

      const encodedPayload = btoa(JSON.stringify(mockPayload));
      const mockIdToken = `header.${encodedPayload}.signature`;

      const result = googleAuthService.decodeIdToken(mockIdToken);

      expect(result).toEqual({
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        photo: 'https://example.com/photo.jpg',
        emailVerified: true,
      });
    });

    it('잘못된 토큰은 null을 반환해야 함', () => {
      const result = googleAuthService.decodeIdToken('invalid-token');

      expect(result).toBeNull();
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
