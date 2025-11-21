/**
 * 인증 관련 커스텀 훅
 */

import { useAuthStore } from './store';

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
  const user = useAuthStore(state => state.user);
  const isLoading = useAuthStore(state => state.isLoading);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const signIn = useAuthStore(state => state.signIn);
  const signOut = useAuthStore(state => state.signOut);
  const refreshUser = useAuthStore(state => state.refreshUser);

  return {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    refreshUser,
  };
};
