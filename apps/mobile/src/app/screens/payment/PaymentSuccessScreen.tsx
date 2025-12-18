import { PaymentParamList } from '@app/navigation/types';
import { Button, Text, tw, Spacer } from '@mockly/design-system';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { View } from 'react-native';

type Props = StackScreenProps<PaymentParamList, 'PaymentSuccess'>;

export const PaymentSuccessScreen = ({}: Props) => {
  const navigator = useNavigation();

  const handleGoHome = () => {
    navigator.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  const handleViewHistory = () => {
    navigator.reset({
      index: 0,
      routes: [
        { name: 'MainTabs' },
        { name: 'Payments', params: { screen: 'PaymentHistory' } },
      ],
    });
  };

  return (
    <View
      style={tw`flex-1 justify-center items-center px-6 bg-background dark:bg-background-dark`}
    >
      {/* Success Icon */}
      <View style={tw`mb-6`}>
        <Text style={tw`text-7xl text-center`}>✅</Text>
      </View>

      {/* Title */}
      <Text variant="h2" color="text" style={tw`font-bold text-center mb-3`}>
        결제가 완료되었습니다
      </Text>

      {/* Description */}
      <Text variant="body" color="textSecondary" style={tw`text-center mb-2`}>
        결제가 정상적으로 처리되었습니다.
      </Text>
      <Text variant="body" color="textSecondary" style={tw`text-center mb-8`}>
        이용해 주셔서 감사합니다.
      </Text>

      {/* Actions */}
      <View style={tw`w-full max-w-sm gap-3`}>
        <Button variant="primary" size="large" onPress={handleGoHome}>
          <Button.Text>홈으로</Button.Text>
        </Button>

        <Button variant="outline" size="large" onPress={handleViewHistory}>
          <Button.Text>결제 내역 보기</Button.Text>
        </Button>
      </View>

      <Spacer size="xl" />

      {/* Help Text */}
      <Text variant="caption" color="textSecondary" style={tw`text-center`}>
        결제 영수증은 이메일로 발송됩니다.
      </Text>
    </View>
  );
};
