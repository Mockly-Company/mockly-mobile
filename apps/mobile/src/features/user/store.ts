import { User, UserProfile } from '@mockly/domain';
import { create } from 'zustand';

type ProfileState = SignedProfileState | UnSignedProfileState;

type SignedProfileState = {
  user: User;
  subscription: ProfileSubscription;
  isSigned: true;
};
type UnSignedProfileState = {
  user: null;
  subscription: null;
  isSigned: false;
};

type ProfileSubscription = UserProfile['subscription'];

interface ProfileActions {
  clearProfile: () => void;
  setProfile: (user: User, subscription: ProfileSubscription) => void;
}

type ProfileStore = ProfileState & ProfileActions;

export const useProfileStore = create<ProfileStore>(set => ({
  ...initialStoreState,

  setProfile: (user, subscription) => {
    set({ user, subscription, isSigned: true });
  },
  clearProfile: () => {
    set(initialStoreState);
  },
}));

const initialStoreState: UnSignedProfileState = {
  user: null,
  subscription: null,
  isSigned: false,
};
