import { PaymentParamList } from '@app/navigation/types';
import { Button, Text, tw, Spacer } from '@mockly/design-system';

import { StackScreenProps } from '@react-navigation/stack';
import { View } from 'react-native';

type Props = StackScreenProps<PaymentParamList, 'PaymentFail'>;

export const PaymentFailScreen = ({ navigation }: Props) => {
  const handleGoBack = () => {
    navigation.pop();
  };

  const handleRetry = () => {
    navigation.pop();
  };

  return (
    <View
      style={tw`flex-1 justify-center items-center px-6 bg-background dark:bg-background-dark`}
    >
      {/* Error Icon */}
      <View style={tw`mb-6`}>
        <Text style={tw`text-7xl text-center`}>❌</Text>
      </View>

      {/* Title */}
      <Text variant="h2" color="text" style={tw`font-bold text-center mb-3`}>
        결제에 실패했습니다
      </Text>

      {/* Description */}
      <Text variant="body" color="textSecondary" style={tw`text-center mb-2`}>
        결제 처리 중 문제가 발생했습니다.
      </Text>
      <Text variant="body" color="textSecondary" style={tw`text-center mb-8`}>
        잠시 후 다시 시도해주세요.
      </Text>

      {/* Actions */}
      <View style={tw`w-full max-w-sm gap-3`}>
        <Button
          variant="primary"
          size="large"
          onPress={handleRetry}
          accessibilityLabel="상품 선택 화면"
          accessibilityHint="다시 상품 선택 화면으로 이동합니다"
        >
          <Button.Text>다시 시도</Button.Text>
        </Button>

        <Button
          variant="outline"
          size="large"
          onPress={handleGoBack}
          accessibilityLabel="결제 취소"
          accessibilityHint="다시 상품 선택 화면으로 이동합니다"
        >
          <Button.Text>취소</Button.Text>
        </Button>
      </View>

      <Spacer size="xl" />

      {/* Help Text */}
      <Text variant="caption" color="textSecondary" style={tw` text-center`}>
        문제가 계속되면 고객센터로 문의해주세요.
      </Text>
    </View>
  );
};
