import {
  AccessRefreshToken,
  AuthToken,
  DeviceInfo,
  LocationInfo,
} from '@mockly/domain';
import type { AuthConfig, AuthorizationResult, AuthProvider } from '../types';
import { AppError, ErrorCoverage } from '@errors/AppError';
import { deviceInfo as deviceInfoFromUtil } from '@libs/deviceInfo';
import api from '@mockly/api';
import { capitalize } from '@utils/stringUtils';
import { localStorage } from '../localStorage';

/**
 * 모든 3rd party 인증 서비스의 추상 클래스
 * Provider별로 이 클래스를 상속받아 구현
 */

export abstract class BaseAuthService {
  protected config: AuthConfig;
  public error: Error | null = null;
  constructor(config: AuthConfig) {
    this.config = config;
  }

  // PKCE를 사용한 인증 필수.
  abstract authorize(): Promise<AuthorizationResult | null>;

  public async exchangeCodeForToken(
    authorizationCode: string,
    codeVerifier: string,
    provider: AuthProvider,
  ): Promise<AuthToken> {
    try {
      const deviceInfo: DeviceInfo = {
        deviceId: deviceInfoFromUtil.getDevice(),
        deviceName: await deviceInfoFromUtil.getDeviceName(),
      };
      // TODO: 추후 없어질 예정.
      const locationInfo: LocationInfo = { latitude: 0, longitude: 0 };

      const data = await api.auth.loginWithPKCECode(
        {
          code: authorizationCode,
          codeVerifier,
          redirectUri: this.config.redirectUrl,
          deviceInfo,
          locationInfo,
        },
        provider,
      );

      if (!data) {
        const error = new AppError(
          '서버로부터 토큰을 획득하지 못했습니다.',
          ErrorCoverage.NONE,
          '토큰 획득 실패',
        );
        throw error;
      }
      return data;
    } catch (err) {
      if (AppError.isApiError(err)) {
        throw err;
      }
      const error = new AppError(
        `${capitalize(provider)} 토큰 교환 중 오류가 발생했습니다.`,
        ErrorCoverage.NONE,
        '토큰 교환 실패',
      );

      throw error;
    }
  }

  public async refreshAccessToken(
    refreshToken: string,
  ): Promise<AccessRefreshToken> {
    const deviceInfo = {
      deviceId: deviceInfoFromUtil.getDevice(),
      deviceName: await deviceInfoFromUtil.getDeviceName(),
    };
    const data = await api.auth.renewalToken(refreshToken, deviceInfo);
    if (!data)
      throw new AppError(
        '서버로부터 갱신된 토큰을 획득하지 못했습니다.',
        ErrorCoverage.NONE,
        '토큰 갱신 실패',
      );
    return data;
  }

  async logout(): Promise<boolean> {
    try {
      const refreshToken = await localStorage.getRefreshToken();
      if (refreshToken) await api.auth.logout(refreshToken);
      return true;
    } catch (err) {
      throw err;
    } finally {
      await localStorage.clear();
    }
  }
}
