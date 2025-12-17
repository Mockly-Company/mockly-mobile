import { AuthUser, UserProfile } from '@mockly/domain';
import { create } from 'zustand';

type ProfileState = SignedProfileState | UnSignedProfileState;

type SignedProfileState = {
  user: ProfileUser;
  subscription: ProfileSubscription;
  isSigned: true;
};
type UnSignedProfileState = {
  user: null;
  subscription: null;
  isSigned: false;
};

type ProfileUser = AuthUser;
type ProfileSubscription = UserProfile['subscription'];

interface ProfileActions {
  clear: () => void;
  initialize: (user: ProfileUser, subscription: ProfileSubscription) => void;
}

type ProfileStore = ProfileState & ProfileActions;

export const useProfileStore = create<ProfileStore>(set => ({
  ...initialStoreState,

  initialize: (user, subscription) => {
    set({ user, subscription, isSigned: true });
  },
  clear: () => {
    set(initialStoreState);
  },
}));

const initialStoreState: UnSignedProfileState = {
  user: null,
  subscription: null,
  isSigned: false,
};
