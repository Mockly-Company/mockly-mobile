/**
 * 인증 관련 커스텀 훅
 */

import { useAuthStore } from './store';
import { useShallow } from 'zustand/react/shallow';
/**
 * 인증 상태 및 기능을 사용하기 위한 훅
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, signIn, signOut } = useAuth();
 *
 * // Google 로그인
 * await signIn('google');
 *
 * // 로그아웃
 * await signOut();
 * ```
 */
export const useAuth = () => {
  const AuthContext = useAuthStore(
    useShallow(state => ({
      user: state.user,
      isLoading: state.isLoading,
      isAuthenticated: state.isAuthenticated,
      signIn: state.signIn,
      signOut: state.signOut,
      error: state.error,
      clearError: state.clearError,
      setError: state.setError,
    })),
  );
  return AuthContext;
};

/**
 * 로그인된 사용자 정보를 안전하게 가져오는 훅
 *
 * 이 훅은 사용자가 반드시 로그인되어 있어야 하는 컴포넌트에서 사용합니다.
 * user가 null인 경우 에러를 발생시켜 타입 안전성을 보장합니다.
 */
export const useLoggedInAuth = () => {
  const authenticatedContext = useAuthStore(
    useShallow(state => ({
      user: state.user,
      isLoading: state.isLoading,
      signOut: state.signOut,
      error: state.error,
      clearError: state.clearError,
      setError: state.setError,
    })),
  );
  const user = authenticatedContext.user;
  // TODO: 타입 가드 활용하거나, 더 좋은 방법 생각.
  if (!user) {
    throw new Error(
      '사용자가 인증되지 않았습니다. 이 훅은 로그인된 사용자만 사용할 수 있습니다.',
    );
  }

  return authenticatedContext as typeof authenticatedContext & {
    user: NonNullable<typeof user>;
  };
};

/** 초기 인증 상태를 설정하는 훅 */
export const useInitializeAuth = () => {
  const initializeAuth = useAuthStore(state => state.initialize);

  return initializeAuth;
};
