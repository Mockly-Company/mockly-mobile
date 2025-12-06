import { View, Text, Image } from 'react-native';
import { tw } from '@mockly/design-system';
import { useLoggedInAuth } from '@features/auth/hooks';
import { capitalize } from '@shared/utils/stringUtils';
import { LogoutButton } from '@features/auth/components/LogoutButton';

export const MyPageScreen = () => {
  const { user } = useLoggedInAuth();

  return (
    <View style={tw`flex-1 justify-center items-center p-5`}>
      <View style={tw`items-center mb-8`}>
        {user.photo && (
          <Image
            source={{ uri: user.photo }}
            style={tw`w-25 h-25 rounded-full mb-4`}
          />
        )}
        <Text style={tw`text-2xl font-bold mb-2 text-zinc-900 dark:text-white`}>
          {user.name || '이름 없음'}
        </Text>
        <Text style={tw`text-base text-zinc-600 dark:text-zinc-300 mb-1`}>
          {user.email}
        </Text>
        <Text style={tw`text-sm text-zinc-400 dark:text-zinc-500`}>
          {capitalize(user.provider)} 로그인
        </Text>
      </View>
      <LogoutButton />
    </View>
  );
};
