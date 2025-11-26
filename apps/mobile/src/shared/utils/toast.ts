import Toast from 'react-native-toast-message';

type ToastFunction = (
  message: string,
  description?: string,
  position?: 'top' | 'bottom',
) => void;
export const toast: {
  success: ToastFunction;
  error: ToastFunction;
  info: ToastFunction;
  warning: ToastFunction;
} = {
  success: (
    message: string,
    description?: string,
    position: 'top' | 'bottom' = 'top',
  ) => showToast('success', message, description, position),

  error: (
    message: string,
    description?: string,
    position: 'top' | 'bottom' = 'top',
  ) => showToast('error', message, description, position),

  info: (
    message: string,
    description?: string,
    position: 'top' | 'bottom' = 'top',
  ) => showToast('info', message, description, position),

  warning: (
    message: string,
    description?: string,
    position: 'top' | 'bottom' = 'top',
  ) => showToast('warning', message, description, position),
};

type ToastType = 'success' | 'error' | 'info';

interface ToastConfig {
  type: ToastType;
  visibilityTime: number;
}
// 상수 정의
const DEBOUNCE_TIME = 300; // ms
const TOAST_DURATION = {
  SHORT: 3000,
  MEDIUM: 3500,
  LONG: 4000,
} as const;

// 중복 메시지 방지를 위한 상태
let lastToastMessage = '';
let lastToastTime = 0;

/**
 * Toast 메시지를 표시하는 내부 함수
 */
const showToast = (
  configKey: keyof typeof TOAST_CONFIGS,
  message: string,
  description?: string,
  position: 'top' | 'bottom' = 'top',
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
    visibilityTime: config.visibilityTime,
    text1: message,
    text2: description,
    position: position,
  });
};

const TOAST_CONFIGS: Record<string, ToastConfig> = {
  success: { type: 'success', visibilityTime: TOAST_DURATION.SHORT },
  error: { type: 'error', visibilityTime: TOAST_DURATION.LONG },
  info: { type: 'info', visibilityTime: TOAST_DURATION.SHORT },
  warning: { type: 'info', visibilityTime: TOAST_DURATION.MEDIUM },
};
