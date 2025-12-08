import { useCallback, useMemo, forwardRef } from 'react';
import { View, ActivityIndicator, useColorScheme } from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { tw, Text } from '@mockly/design-system';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@features/auth/hooks';
import { SignInButton } from '@features/auth/components/SignInButton';

type LoginBottomSheetProps = Record<string, unknown>;

export const LoginBottomSheet = forwardRef<BottomSheet, LoginBottomSheetProps>(
  (_, ref) => {
    const { isLoading } = useAuth();
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const snapPoints = useMemo(() => ['30%'], []);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      [],
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={!isLoading}
        backgroundStyle={tw`bg-white dark:bg-zinc-900`}
        handleIndicatorStyle={tw`bg-zinc-300 dark:bg-zinc-700`}
      >
        <BottomSheetView
          style={[tw`px-6 pb-4 gap-2 flex-1`, { paddingBottom: insets.bottom }]}
        >
          <Text
            variant="h3"
            weight="bold"
            color="text"
            align="center"
            style={tw`mb-md`}
          >
            로그인하고 계속하기
          </Text>

          <SignInButton provider="google" />
          <SignInButton provider="apple" />

          {isLoading && (
            <View
              style={tw`absolute inset-0 bg-white/80 dark:bg-zinc-900/80 items-center justify-center z-50`}
              accessible={true}
              accessibilityLabel="로그인 처리 중"
              accessibilityRole="progressbar"
            >
              <ActivityIndicator
                size="large"
                color={colorScheme === 'dark' ? '#ffffff' : '#18181b'}
              />
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

LoginBottomSheet.displayName = 'LoginBottomSheet';
