/**
 * Toast 메시지 유틸리티
 * react-native-toast-message를 래핑하여 일관된 Toast UI 제공
 */

import Toast from 'react-native-toast-message';

export const showToast = {
  /**
   * 에러 Toast 표시
   */
  error(message: string, description?: string) {
    Toast.show({
      type: 'error',
      text1: message,
      text2: description,
      visibilityTime: 4000,
      position: 'top',
    });
  },

  /**
   * 성공 Toast 표시
   */
  success(message: string, description?: string) {
    Toast.show({
      type: 'success',
      text1: message,
      text2: description,
      visibilityTime: 3000,
      position: 'top',
    });
  },

  /**
   * 정보 Toast 표시
   */
  info(message: string, description?: string) {
    Toast.show({
      type: 'info',
      text1: message,
      text2: description,
      visibilityTime: 3000,
      position: 'top',
    });
  },
};
