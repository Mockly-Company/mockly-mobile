/**
 * 인증 관련 커스텀 훅
 */

import { useAuthStore } from './store';
import { useShallow } from 'zustand/react/shallow';
import { AuthProvider } from '@mockly/domain';
import { useProfileStore } from '@features/user';
import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { queries } from '@configs/queryClient/QueryKeys';

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
      provider: state.provider,
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

/** 초기 인증 상태를 설정하는 훅 */
export const useInitializeAuthAndGetProfile = () => {
  const { initializeAuth, signOut } = useAuthStore(
    useShallow(state => ({
      initializeAuth: state.initialize,
      signOut: state.signOut,
    })),
  );
  const setProfile = useProfileStore(useShallow(state => state.setProfile));
  const { refetch: fetchUserProfile } = useProfilerFetcher();

  const initializeAuthAndGetProfile = async () => {
    const storedProvider = await initializeAuth();
    if (!storedProvider) return;
    const { data: profile, isSuccess } = await fetchUserProfile();
    if (!isSuccess) return await signOut();

    const profile_user = { ...profile.user, provider: storedProvider };
    const profile_subscription = profile.subscription;
    setProfile(profile_user, profile_subscription);
  };

  return initializeAuthAndGetProfile;
};

// 로그인 훅
export const useSignIn = () => {
  const { signIn, signOut, error, clearError } = useAuthStore(
    useShallow(state => {
      return {
        signIn: state.signIn,
        signOut: state.signOut,
        error: state.error,
        clearError: state.clearError,
      };
    }),
  );
  const setProfile = useProfileStore(useShallow(state => state.setProfile));
  const { refetch: fetchUserProfile } = useProfilerFetcher();

  const { mutateAsync: login } = useMutation({
    mutationKey: ['auth', 'signIn'],
    mutationFn: async (provider: AuthProvider) => {
      const isAuthenticated = await signIn(provider);
      if (!isAuthenticated) {
        return;
      }
      const { data: profile, isSuccess } = await fetchUserProfile();
      if (!isSuccess) {
        signOut();
        return;
      }
      const profile_user = { ...profile.user, provider };
      const profile_subscription = profile.subscription;
      setProfile(profile_user, profile_subscription);
      return profile_user.name;
    },
  });
  const isPending =
    useIsMutating({
      mutationKey: ['auth', 'signIn'],
    }) > 0;
  return { signIn: login, isPending, error, clearError };
};

// 로그아웃 훅
export const useSignOut = () => {
  const queryClient = useQueryClient();
  const { signOut } = useAuthStore(
    useShallow(state => {
      return {
        signOut: state.signOut,
      };
    }),
  );
  const { mutateAsync: logout } = useMutation({
    mutationKey: ['auth', 'signOut'],
    mutationFn: async () => {
      await signOut();
      await queryClient.invalidateQueries();
    },
  });
  const isPending =
    useIsMutating({
      mutationKey: ['auth', 'signOut'],
    }) > 0;
  return { signOut: logout, isPending };
};

const useProfilerFetcher = () =>
  useQuery({
    ...queries.user.profile(),
    enabled: false,
  });
