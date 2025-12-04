import * as Keychain from 'react-native-keychain';
import { getDeviceName as getDeviceNameFromLib } from 'react-native-device-info';
const DEVICE_ID_KEY = 'mockly.device_id';

/**
 * UUID v4 생성 (간단한 구현)
 */
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
let DEVICE_ID = '';
/**
 * Device ID 초기화 (앱 시작 시 호출)
 */
const initializeDevice = async (): Promise<string> => {
  // Keychain에서 불러오기
  const credentials = await Keychain.getGenericPassword({
    service: DEVICE_ID_KEY,
  });

  if (credentials && credentials.password) {
    DEVICE_ID = credentials.password;
    return credentials.password;
  }

  // 없으면 생성 및 저장
  const newDeviceId = generateUUID();
  await Keychain.setGenericPassword(DEVICE_ID_KEY, newDeviceId, {
    service: DEVICE_ID_KEY,
    accessible: Keychain.ACCESSIBLE.ALWAYS,
  });

  DEVICE_ID = newDeviceId;
  return newDeviceId;
};

const getDeviceName = async (): Promise<string> => {
  try {
    const deviceName = await getDeviceNameFromLib();
    return deviceName;
  } catch {
    return 'unknown Device';
  }
};

export const deviceInfo = {
  initializeDevice,
  getDeviceName,
  getDevice: () => DEVICE_ID,
};
