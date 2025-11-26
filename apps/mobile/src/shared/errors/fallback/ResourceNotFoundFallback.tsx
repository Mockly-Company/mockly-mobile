import { tw } from '@mockly/design-system';
import { View, Text } from 'react-native';

interface Props {
  message?: string;
  resourceType?: string;
}

/**
 * 리소스를 찾을 수 없을 때 표시되는 Fallback UI (404)
 */
export function ResourceNotFoundFallback({
  message = '요청한 정보를 찾을 수 없습니다',
  resourceType = '리소스',
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔍</Text>
      <Text style={styles.title}>찾을 수 없음</Text>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.description}>
        {resourceType}가 삭제되었거나 존재하지 않습니다.
      </Text>
    </View>
  );
}
const styles = {
  container: tw`flex-1 justify-center items-center p-5 bg-gray-100`,
  icon: tw`text-6xl mb-4`,
  title: tw`text-2xl font-bold text-gray-800 mb-2`,
  message: tw`text-base text-gray-600 text-center mb-2`,
  description: tw`text-sm text-gray-500 text-center`,
};
