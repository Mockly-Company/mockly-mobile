import { useSignOut } from '@features/auth/hooks';
import { tw, Text } from '@mockly/design-system';
import { toast } from '@libs/toast';
import { TouchableOpacity, ActivityIndicator } from 'react-native';

export const LogoutButton = () => {
  const { signOut, isPending } = useSignOut();

  const handleLogout = async () => {
    await signOut().catch(() => {
      toast.error('로그아웃에 실패했습니다.', '다시 시도해주세요.');
    });
    toast.success('로그아웃 되었습니다.', '다시 만나요~!');
  };
  return (
    <TouchableOpacity
      style={[
        tw`bg-red-500 px-8 py-3 rounded-lg w-full items-center`,
        isPending && tw`opacity-50`,
      ]}
      onPress={handleLogout}
      disabled={isPending}
      accessible={true}
      accessibilityLabel="로그아웃"
      accessibilityRole="button"
      testID="logout-button"
    >
      {isPending ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text variant="body" weight="semibold" color="white">
          로그아웃
        </Text>
      )}
    </TouchableOpacity>
  );
};
