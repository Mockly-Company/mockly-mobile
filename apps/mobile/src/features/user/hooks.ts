import { useShallow } from 'zustand/react/shallow';
import { useProfileStore } from './store';
import { AppError, ErrorCoverage } from '@shared/errors';

export const useInitializeProfile = () => {
  const initializeProfile = useProfileStore(
    useShallow(state => state.initialize),
  );

  return initializeProfile;
};

export const useUserProfile = () => {
  const { user, subscription, isSigned } = useProfileStore(
    useShallow(state => ({
      user: state.user,
      subscription: state.subscription,
      isSigned: state.isSigned,
    })),
  );
  if (!user || !subscription || !isSigned) {
    throw new AppError(
      '프로필 정보가 없습니다.',
      ErrorCoverage.GLOBAL,
      '다시 로그인해주세요.',
    );
  }

  return { user, subscription };
};
