import { tw, Text } from '@mockly/design-system';
import { View } from 'react-native';

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
    <View
      style={tw`flex-1 justify-center items-center p-5 bg-gray-100`}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel={`${resourceType}를 찾을 수 없습니다. ${message}`}
    >
      <Text style={tw`text-6xl mb-4`}>🔍</Text>
      <Text variant="h2" weight="bold" color="black" style={tw`mb-2`}>
        찾을 수 없음
      </Text>
      <Text variant="body" color="secondary" align="center" style={tw`mb-2`}>
        {message}
      </Text>
      <Text variant="caption" color="textSecondary" align="center">
        {resourceType}가 삭제됐거나 존재하지 않습니다.
      </Text>
    </View>
  );
}
