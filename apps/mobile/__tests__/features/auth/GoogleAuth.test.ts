import { authorize } from 'react-native-app-auth';
import { GoogleAuthService } from '@features/auth/services/GoogleAuthService';

// @mockly/api 모킹
jest.mock('@mockly/api', () => ({
  loginWithPKCECode: jest.fn(),
  renewalToken: jest.fn(),
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
});
