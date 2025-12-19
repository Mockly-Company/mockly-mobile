import { Button, tw } from '@mockly/design-system';

type PurchaseCTAProps = {
  onPress: () => void;
  content: string;
  disabled: boolean;
};

export const PurchaseCTA = ({
  onPress,
  content,
  disabled,
}: PurchaseCTAProps) => {
  return (
    <Button
      onPress={onPress}
      disabled={disabled}
      size="medium"
      style={tw`w-full`}
      accessibilityLabel="주문 시작"
      accessibilityHint="선택한 플랜으로 주문을 시작합니다"
    >
      <Button.Text>{content}</Button.Text>
    </Button>
  );
};
