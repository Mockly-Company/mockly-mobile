import Toast from 'react-native-toast-message';

/**
 * Toast 알림 표시 유틸리티
 */
export const toast = {
  /**
   * 성공 메시지 표시
   */
  success: (message: string, description?: string) => {
    Toast.show({
      type: 'success',
      text1: message,
      text2: description,
      position: 'top',
      visibilityTime: 3000,
    });
  },

  /**
   * 에러 메시지 표시
   */
  error: (message: string, description?: string) => {
    Toast.show({
      type: 'error',
      text1: message,
      text2: description,
      position: 'top',
      visibilityTime: 4000,
    });
  },

  /**
   * 정보 메시지 표시
   */
  info: (message: string, description?: string) => {
    Toast.show({
      type: 'info',
      text1: message,
      text2: description,
      position: 'top',
      visibilityTime: 3000,
    });
  },

  /**
   * 경고 메시지 표시
   */
  warning: (message: string, description?: string) => {
    Toast.show({
      type: 'info', // react-native-toast-message에는 warning 타입이 없으므로 info 사용
      text1: message,
      text2: description,
      position: 'top',
      visibilityTime: 3500,
    });
  },
};
