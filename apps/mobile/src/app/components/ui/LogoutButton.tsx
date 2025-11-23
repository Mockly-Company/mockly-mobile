import { useAuth } from '@features/auth/hooks';
import { tw } from '@mockly/design-system';
import { Alert, Text, TouchableOpacity } from 'react-native';
const styles = {
  logoutButton: tw`bg-red-500 px-8 py-3 rounded-lg`,
  logoutButtonText: tw`text-white text-base font-semibold`,
};
export const LogoutButton = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      // TODO: TOAST 공통 컴포넌트 개발시 수정
      Alert.alert(
        '로그아웃 실패',
        '로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.',
        [{ text: '확인' }],
      );
      console.error('로그아웃 실패:', error);
    }
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
