import { authorize, AppAuthError } from 'react-native-app-auth';
import { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_REDIRECT_URI } from '@env';

import { BaseAuthService } from './BaseAuthService';
import type { AuthConfig, AuthorizationResult } from '../types';
import { AppError, ErrorCoverage } from '@errors/AppError';

const config: AuthConfig = {
  issuer: 'https://accounts.google.com',
  clientId: GOOGLE_ANDROID_CLIENT_ID,
  redirectUrl: GOOGLE_REDIRECT_URI,
  scopes: ['openid', 'email', 'profile'],
};

export class GoogleAuthService extends BaseAuthService {
  constructor() {
    if (!GOOGLE_ANDROID_CLIENT_ID) {
      throw new AppError(
        'GOOGLE_ANDROID_CLIENT_ID가 없습니다. 환경 변수 설정을 확인하세요.',
        ErrorCoverage.GLOBAL,
        '환경 설정 오류',
      );
    }

    super(config);
  }

  async authorize(): Promise<AuthorizationResult | null> {
    try {
      const result = await authorize({
        ...this.config,
        skipCodeExchange: true, // 토큰 교환은 백엔드에서 처리
        usePKCE: true,
      });

      if (!result.authorizationCode || !result.codeVerifier) {
        return null;
      }
      return {
        authorizationCode: result.authorizationCode,
        codeVerifier: result.codeVerifier,
      };
    } catch (err: unknown) {
      const appAuthError = err as AppAuthError;
      const cancelledByUser =
        appAuthError.message === 'User cancelled flow' ||
        appAuthError.code === 'access_denied';
      if (cancelledByUser) {
        return null;
      }
      throw new AppError(err, ErrorCoverage.NONE, 'Google 인증 중 오류 발생');
    }
  }
}
