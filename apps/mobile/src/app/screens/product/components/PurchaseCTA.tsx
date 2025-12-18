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
    >
      <Button.Text>{content}</Button.Text>
    </Button>
  );
};
