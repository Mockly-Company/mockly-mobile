import Toast from 'react-native-toast-message';

type ToastType = 'success' | 'error' | 'info';

interface ToastConfig {
  type: ToastType;
  visibilityTime: number;
}

// 상수 정의
const TOAST_POSITION = 'top' as const;
const TOAST_DURATION = {
  SHORT: 3000,
  MEDIUM: 3500,
  LONG: 4000,
} as const;

const TOAST_CONFIGS: Record<string, ToastConfig> = {
  success: { type: 'success', visibilityTime: TOAST_DURATION.SHORT },
  error: { type: 'error', visibilityTime: TOAST_DURATION.LONG },
  info: { type: 'info', visibilityTime: TOAST_DURATION.SHORT },
  warning: { type: 'info', visibilityTime: TOAST_DURATION.MEDIUM },
};

// 중복 메시지 방지를 위한 상태
let lastToastMessage = '';
let lastToastTime = 0;
const DEBOUNCE_TIME = 300; // ms

/**
 * Toast 메시지를 표시하는 내부 함수
 */
const showToast = (
  configKey: keyof typeof TOAST_CONFIGS,
  message: string,
  description?: string,
) => {
  const now = Date.now();
  const isDuplicate =
    message === lastToastMessage && now - lastToastTime < DEBOUNCE_TIME;

  if (isDuplicate) return;

  lastToastMessage = message;
  lastToastTime = now;

  const config = TOAST_CONFIGS[configKey];
  Toast.show({
    type: config.type,
    text1: message,
    text2: description,
    position: TOAST_POSITION,
    visibilityTime: config.visibilityTime,
  });
};

type ToastFunction = (message: string, description?: string) => void;

/**
 * Toast 알림 표시 유틸리티
 */
export const toast: {
  success: ToastFunction;
  error: ToastFunction;
  info: ToastFunction;
  warning: ToastFunction;
} = {
  /**
   * 성공 메시지 표시
   */
  success: (message: string, description?: string) => {
    showToast('success', message, description);
  },

  /**
   * 에러 메시지 표시
   */
  error: (message: string, description?: string) => {
    showToast('error', message, description);
  },

  /**
   * 정보 메시지 표시
   */
  info: (message: string, description?: string) => {
    showToast('info', message, description);
  },

  /**
   * 경고 메시지 표시
   */
  warning: (message: string, description?: string) => {
    showToast('warning', message, description);
  },
};
