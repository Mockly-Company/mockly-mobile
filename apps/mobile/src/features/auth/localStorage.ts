/**
 * 토큰 저장 관리 유틸리티
 * - Access Token: MMKV (빠른 접근)
 * - Refresh Token: Keychain (보안)
 */

import { createMMKV } from 'react-native-mmkv';
import * as Keychain from 'react-native-keychain';
import { logger } from '@shared/utils/logger';

import { AccessRefreshToken, AuthUser, AuthUserSchema } from '@mockly/domain';
import { AppError, ErrorCoverage } from '@shared/errors';
const storage = createMMKV({ id: 'token-storage' });

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_SERVICE = 'mockly.refresh_token';
const USER_INFO_KEY = 'user_info';
const saveAccessToken = (accessToken: string): void => {
  storage.set(ACCESS_TOKEN_KEY, accessToken);
};

const getAccessToken = (): string | null => {
  return storage.getString(ACCESS_TOKEN_KEY) || null;
};

const saveRefreshToken = async (refreshToken: string): Promise<void> => {
  try {
    await Keychain.setGenericPassword(REFRESH_TOKEN_SERVICE, refreshToken, {
      service: REFRESH_TOKEN_SERVICE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
    });
  } catch (err) {
    logger.logException(err, {
      context: 'saveRefreshToken',
      message: 'Refresh Token 저장 실패',
    });
    throw err;
  }
};

const getRefreshToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: REFRESH_TOKEN_SERVICE,
    });

    if (credentials && credentials.password) {
      return credentials.password;
    }
    return null;
  } catch (err) {
    logger.logException(err, {
      context: 'getRefreshToken',
      message: 'Refresh Token 가져오기 실패',
    });
    return null;
  }
};

const clear = async (): Promise<void> => {
  try {
    storage.remove(ACCESS_TOKEN_KEY);
    storage.remove(USER_INFO_KEY);
    await Keychain.resetGenericPassword({
      service: REFRESH_TOKEN_SERVICE,
    });
  } catch (err) {
    logger.logException(err, {
      context: 'clearTokens',
      message: '토큰 삭제 실패',
    });
  }
};

const saveTokens = async ({
  accessToken,
  refreshToken,
}: AccessRefreshToken): Promise<void> => {
  saveAccessToken(accessToken);
  await saveRefreshToken(refreshToken);
};

const getTokens = async (): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
}> => {
  const accessToken = getAccessToken();
  const refreshToken = await getRefreshToken();

  return { accessToken, refreshToken };
};
const saveUser = (user: AuthUser) => {
  storage.set(USER_INFO_KEY, JSON.stringify(user));
};

const getUser = (): AuthUser | null => {
  const userString = storage.getString(USER_INFO_KEY);
  if (userString) {
    try {
      const parsed = JSON.parse(userString);
      return AuthUserSchema.parse(parsed);
    } catch {
      clear();
      throw new AppError(
        '저장된 사용자 정보가 손상되었습니다.',
        ErrorCoverage.NONE,
        '사용자 정보 파싱 실패',
      );
    }
  }
  return null;
};
/**
 * 토큰 스토리지 API
 */
export const localStorage = {
  /** 토큰 쌍 저장 (Access + Refresh) */
  saveTokens,
  /** 토큰 쌍 가져오기 */
  getTokens,
  /** 모든 토큰 삭제 */
  clear,
  /** Access Token 저장 (MMKV) */
  saveAccessToken,
  /** Access Token 가져오기 (MMKV) */
  getAccessToken,
  /** Refresh Token 저장 (Keychain) */
  saveRefreshToken,
  /** Refresh Token 가져오기 (Keychain) */
  getRefreshToken,
  saveUser,
  getUser,
};
