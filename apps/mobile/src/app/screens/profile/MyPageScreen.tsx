import { View, Text, Image, ActivityIndicator } from 'react-native';
import { colors, tw } from '@mockly/design-system';
import { GoogleLoginButton } from '@app/components/ui/GoogleLoginButton';
import { useAuth } from '@features/auth/hooks';
import { capitalize } from '@shared/utils/stringUtils';
import { LogoutButton } from '@app/components/ui/LogoutButton';
const styles = {
  container: tw`flex-1 justify-center items-center bg-white p-5`,
  profileContainer: tw`items-center mb-8`,
  profileImage: tw`w-25 h-25 rounded-full mb-4`,
  name: tw`text-2xl font-bold mb-2 text-black`,
  email: tw`text-base text-gray-600 mb-1`,
  provider: tw`text-sm text-gray-400`,
  logoutButton: tw`bg-red-500 px-8 py-3 rounded-lg`,
  logoutButtonText: tw`text-white text-base font-semibold`,
};

export const MyPageScreen = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
          testID="activity-indicator"
        />
      </View>
    );
  }

  if (user) {
    // 로그인된 상태
    return (
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          {user.photo && (
            <Image source={{ uri: user.photo }} style={styles.profileImage} />
          )}
          <Text style={styles.name}>{user.name || '이름 없음'}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.provider}>
            {capitalize(user.provider)}
            로그인
          </Text>
        </View>
        <LogoutButton />
      </View>
    );
  }

  // 로그인 안된 상태
  return (
    <View style={styles.container}>
      <GoogleLoginButton />
    </View>
  );
};
