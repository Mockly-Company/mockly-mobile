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
      refreshUser: state.refreshUser,
      error: state.error,
      clearError: state.clearError,
      setError: state.setError,
    })),
  );
  return AuthContext;
};
