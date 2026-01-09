import { FlatList, View, useWindowDimensions } from 'react-native';
import { tw, Button, Icon } from '@mockly/design-system';

interface NumPadProps {
  onPress: (value: string) => void;
  onDelete: () => void;
  disabled?: boolean;
}

const NUMBERS = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '',
  '0',
  'delete',
] as const;

export function NumPad({ onPress, onDelete, disabled = false }: NumPadProps) {
  const { width: screenWidth } = useWindowDimensions();
  const HORIZONTAL_PADDING = 48; // ScreenFooter px-6 * 2 = 24 * 2
  const GAP_SIZE = 12; // gap-3
  const TOTAL_GAP = GAP_SIZE * 2; // 3개 열 사이의 간격
  const MAX_WIDTH = 400; // 최대 너비 제한
  const availableWidth = Math.min(screenWidth - HORIZONTAL_PADDING, MAX_WIDTH);
  const ITEM_WIDTH = (availableWidth - TOTAL_GAP) / 3;
  const ITEM_HEIGHT = 56; // 고정 높이
  const handlePress = (value: string) => {
    if (disabled) return;

    if (value === 'delete') {
      onDelete();
    } else if (value !== '') {
      onPress(value);
    }
  };

  const renderItem = ({ item }: { item: (typeof NUMBERS)[number] }) => {
    const num = item;

    if (num === '') {
      return <View style={{ width: ITEM_WIDTH, height: ITEM_HEIGHT }} />;
    }

    if (num === 'delete') {
      return (
        <Button
          variant="primary"
          size="large"
          onPress={() => handlePress(num)}
          disabled={disabled}
          accessible={true}
          accessibilityLabel={`삭제`}
          accessibilityRole="button"
          style={[
            tw`items-center justify-center`,
            { width: ITEM_WIDTH, height: ITEM_HEIGHT },
          ]}
        >
          <Button.Icon>
            <Icon
              name="delete"
              variant={'text'}
              style={tw`${disabled ? 'opacity-50' : ''}`}
            />
          </Button.Icon>
        </Button>
      );
    }

    return (
      <Button
        onPress={() => handlePress(num)}
        disabled={disabled}
        variant="outline"
        accessible={true}
        accessibilityLabel={`숫자 ${num}`}
        accessibilityRole="button"
        style={[
          tw`items-center justify-center rounded-xl ${disabled ? 'opacity-50' : ''}`,
          { width: ITEM_WIDTH, height: ITEM_HEIGHT },
        ]}
      >
        <Button.Text style={tw`text-2xl font-medium`}>{num}</Button.Text>
      </Button>
    );
  };

  return (
    <FlatList
      data={NUMBERS}
      renderItem={renderItem}
      keyExtractor={(item, index) => `numpad-${index}`}
      numColumns={3}
      columnWrapperStyle={tw`gap-3 justify-center`}
      contentContainerStyle={tw`gap-3`}
      scrollEnabled={false}
    />
  );
}
