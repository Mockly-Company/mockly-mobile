import { useLoggedInAuth } from '@features/auth/hooks';
import { tw } from '@mockly/design-system';
import { toast } from '@shared/utils/toast';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';

export const LogoutButton = () => {
  const { signOut, isLoading } = useLoggedInAuth();

  const handleLogout = async () => {
    await signOut()
      .then(() => {
        toast.success('로그아웃 되었습니다.', '다시 만나요~!');
      })
      .catch(() => {
        toast.error('로그아웃에 실패했습니다.', '다시 시도해주세요.');
      });
  };
  return (
    <TouchableOpacity
      style={[tw`bg-red-500 px-8 py-3 rounded-lg`, isLoading && tw`opacity-50`]}
      onPress={handleLogout}
      disabled={isLoading}
      accessible={true}
      accessibilityLabel="로그아웃"
      accessibilityRole="button"
      testID="logout-button"
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text style={tw`text-white text-base font-semibold`}>로그아웃</Text>
      )}
    </TouchableOpacity>
  );
};
