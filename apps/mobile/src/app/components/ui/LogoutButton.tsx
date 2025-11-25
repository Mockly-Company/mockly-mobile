import { useAuth } from '@features/auth/hooks';
import { tw } from '@mockly/design-system';
import { showToast } from '@shared/utils/toast';
import { Text, TouchableOpacity } from 'react-native';
const styles = {
  logoutButton: tw`bg-red-500 px-8 py-3 rounded-lg`,
  logoutButtonText: tw`text-white text-base font-semibold`,
};
export const LogoutButton = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut()
      .then(() => {
        showToast.success('로그아웃 되었습니다.', '다시 만나요~!');
      })
      .catch(() => {
        showToast.error('로그아웃에 실패했습니다.', '다시 시도해주세요.');
      });
  };
  return (
    <TouchableOpacity
      style={styles.logoutButton}
      onPress={handleLogout}
      accessible={true}
      accessibilityLabel="로그아웃"
      accessibilityRole="button"
      testID="logout-button"
    >
      <Text style={styles.logoutButtonText}>로그아웃</Text>
    </TouchableOpacity>
  );
};
