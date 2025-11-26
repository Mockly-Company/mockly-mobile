import React from 'react';
import Toast, { BaseToast, BaseToastProps } from 'react-native-toast-message';
import { tw } from '@mockly/design-system';

/**
 * Toast 스타일 설정
 */
const toastConfig = {
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={tw`border-l-8 border-l-green-500`}
      contentContainerStyle={tw`px-4`}
      text1Style={tw`text-base font-semibold text-green-600`}
      text2Style={tw`text-sm text-gray-700`}
    />
  ),
  error: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={tw`border-l-8 border-l-red-500`}
      contentContainerStyle={tw`px-4`}
      text1Style={tw`text-base font-semibold text-red-600`}
      text2Style={tw`text-sm text-gray-700`}
    />
  ),
  info: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={tw`border-l-8 border-l-blue-500`}
      contentContainerStyle={tw`px-4`}
      text1Style={tw`text-base font-semibold text-blue-600`}
      text2Style={tw`text-sm text-gray-700`}
    />
  ),
};

/**
 * Toast 컨테이너 컴포넌트
 * - toastConfig를 포함한 Toast 메시지 표시 컴포넌트
 * - App.tsx에서 한 번만 렌더링
 */
export const ToastContainer: React.FC = () => {
  return <Toast config={toastConfig} topOffset={60} />;
};
