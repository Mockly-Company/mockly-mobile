import { useRef, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text,
  TextInputKeyPressEvent,
} from 'react-native';
import { tw } from '@mockly/design-system';
import { cn } from '@mockly/utils';

interface OTPCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
}

export function OTPCodeInput({
  value,
  onChange,
  length = 6,
  disabled = false,
}: OTPCodeInputProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const digits = value.split('');

  // 처음 마운트될 때 첫 번째 칸에 자동 포커스
  useEffect(() => {
    if (!disabled && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [disabled]);

  const handlePress = (index: number) => {
    if (disabled) return;
    inputRefs.current[index]?.focus();
  };

  const handleChange = (text: string, index: number) => {
    const numericText = text.replace(/\D/g, '');

    if (numericText.length === 0) {
      return;
    }

    if (numericText.length === 1) {
      // 한 자리 입력 - 현재 값에 추가
      const newValue = value + numericText;
      onChange(newValue.slice(0, length));

      // 다음 칸으로 이동
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      // 여러 자리 붙여넣기
      onChange(numericText.slice(0, length));

      // 마지막 입력된 칸으로 이동
      const lastIndex = Math.min(numericText.length - 1, length - 1);
      inputRefs.current[lastIndex]?.focus();
    }
  };

  const handleKeyPress = (e: TextInputKeyPressEvent, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      e.preventDefault();

      if (digits[index]) {
        // 현재 칸에 숫자가 있으면 지우기
        onChange(value.slice(0, -1));
      } else if (index > 0) {
        // 현재 칸이 비어있으면 이전 칸으로 이동하고 지우기
        onChange(value.slice(0, -1));
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View style={tw`flex-row justify-between gap-2`}>
      {Array.from({ length }).map((_, index) => {
        const isFocused = focusedIndex === index;
        const hasValue = !!digits[index];

        return (
          <Pressable
            key={`$otp-code-${index}`}
            onPress={() => handlePress(index)}
            style={tw`flex-1 aspect-square`}
          >
            <View
              style={tw`${cn(
                'flex-1 items-center justify-center border-2 rounded-lg',
                {
                  'border-primary bg-surface dark:bg-surface-dark':
                    isFocused || (hasValue && !isFocused),
                  'border-border dark:border-border-dark bg-surface dark:bg-surface-dark':
                    !hasValue && !isFocused,
                  'opacity-50': disabled,
                },
              )}`}
            >
              <TextInput
                ref={ref => {
                  inputRefs.current[index] = ref;
                }}
                value={digits[index] || ''}
                onChangeText={text => handleChange(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                keyboardType="number-pad"
                maxLength={1}
                editable={!disabled}
                selectTextOnFocus
                showSoftInputOnFocus={false}
                caretHidden
                style={tw`absolute inset-0 text-center text-2xl text-text dark:text-text-dark font-bold opacity-0`}
              />
              {/* 시각적 텍스트 표시 */}
              {digits[index] && (
                <Text
                  style={tw`text-2xl font-bold text-text dark:text-text-dark`}
                >
                  {digits[index]}
                </Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
