import { User, UserProfile } from '@mockly/domain';
import { create } from 'zustand';

type ProfileState = SignedProfileState | UnSignedProfileState;

type SignedProfileState = {
  user: User;
  subscription: ProfileSubscription;
  isSigned: true;
  isPhoneVerified: boolean;
};
type UnSignedProfileState = {
  user: null;
  subscription: null;
  isSigned: false;
  isPhoneVerified: false;
};

type ProfileSubscription = UserProfile['subscription'];

interface ProfileActions {
  clearProfile: () => void;
  setProfile: (
    user: User,
    subscription: ProfileSubscription,
    isPhoneVerified: boolean,
  ) => void;
  verifyPhone: (isVerified: boolean) => void;
}

type ProfileStore = ProfileState & ProfileActions;

export const useProfileStore = create<ProfileStore>(set => ({
  ...initialStoreState,

  setProfile: (user, subscription, isPhoneVerified) => {
    set({ user, subscription, isSigned: true, isPhoneVerified });
  },
  clearProfile: () => {
    set(initialStoreState);
  },
  verifyPhone: (isVerified: boolean) => {
    set({ isPhoneVerified: isVerified });
  },
}));

const initialStoreState: UnSignedProfileState = {
  user: null,
  subscription: null,
  isSigned: false,
  isPhoneVerified: false,
};
