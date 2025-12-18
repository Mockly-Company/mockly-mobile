import { useAuth } from '@features/auth/hooks';
import { LoggedInNavigator } from './LoggedInNavigator';
import { LoggedOutNavigator } from './LoggedOutNavigator';
import { useProfileStore } from '@features/user';

export const RootNavigator = () => {
  const { isAuthenticated } = useAuth();
  const { isSigned } = useProfileStore();
  const LoggedIn = isAuthenticated && isSigned;
  return LoggedIn ? <LoggedInNavigator /> : <LoggedOutNavigator />;
};
