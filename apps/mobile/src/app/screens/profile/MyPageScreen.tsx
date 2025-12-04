import { View, Text, Image } from 'react-native';
import { tw } from '@mockly/design-system';
import { useLoggedInAuth } from '@features/auth/hooks';
import { capitalize } from '@shared/utils/stringUtils';
import { LogoutButton } from '@app/components/ui/LogoutButton';
const styles = {
  container: tw`flex-1 justify-center items-center p-5 bg-white dark:bg-zinc-950`,
  profileContainer: tw`items-center mb-8`,
  profileImage: tw`w-25 h-25 rounded-full mb-4`,
  name: tw`text-2xl font-bold mb-2 text-zinc-900 dark:text-white`,
  email: tw`text-base text-zinc-600 dark:text-zinc-300 mb-1`,
  provider: tw`text-sm text-zinc-400 dark:text-zinc-500`,
  logoutButton: tw`bg-red-500 px-8 py-3 rounded-lg`,
  logoutButtonText: tw`text-white text-base font-semibold`,
};

export const MyPageScreen = () => {
  const { user } = useLoggedInAuth();

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        {user.photo && (
          <Image source={{ uri: user.photo }} style={styles.profileImage} />
        )}
        <Text style={styles.name}>{user.name || '이름 없음'}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.provider}>{capitalize(user.provider)} 로그인</Text>
      </View>
      <LogoutButton />
    </View>
  );
};
