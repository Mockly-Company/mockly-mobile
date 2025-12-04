/**
 * 위치 정보 유틸리티
 * GPS 권한 요청 및 현재 위치 가져오기
 */

import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';
import { logger } from './logger';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

/**
 * 위치 권한 요청 (Android만 해당)
 */
async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    return true; // iOS는 Info.plist + Geolocation API 호출 시 자동 처리
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: '위치 권한 요청',
        message: '현재 위치를 사용하기 위해 위치 권한이 필요합니다.',
        buttonNeutral: '나중에',
        buttonNegative: '거부',
        buttonPositive: '허용',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    logger.logException(err, {
      context: 'requestLocationPermission',
      message: '위치 권한 요청 실패',
    });
    return false;
  }
}

/**
 * 권한 확인 후 현재 위치 가져오기
 * 권한이 없으면 자동으로 요청하고, 실패 시 기본값 반환
 *
 * @param options Geolocation 옵션
 * @returns 위도/경도 또는 기본값 { latitude: 0, longitude: 0 }
 */
export async function checkLocationPermissionAndGet(options?: {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}): Promise<LocationCoords> {
  const {
    enableHighAccuracy = false,
    timeout = 10000,
    maximumAge = 60000, // 1분 이내 캐시된 위치 사용
  } = options || {};

  // 권한 요청
  const hasPermission = await requestLocationPermission();

  if (!hasPermission) {
    logger.warn('위치 권한이 거부되어 기본값을 사용합니다.', {
      context: 'checkLocationPermissionAndGet',
    });
    return { latitude: 0, longitude: 0 };
  }

  // 위치 가져오기
  return new Promise(resolve => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        resolve({ latitude: 0, longitude: 0 });
        // 위치 정보 실패 시 기본값 반환
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      },
    );
  });
}
