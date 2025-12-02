import { useCallback, useMemo, forwardRef } from 'react';
import { Text, View, ActivityIndicator, useColorScheme } from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Button, tw } from '@mockly/design-system';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GoogleLoginButton } from '@app/components/ui/GoogleLoginButton';
import { useAuth } from '@features/auth/hooks';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface LoginBottomSheetProps {}

const styles = {
  content: tw`px-6 pb-4 gap-2 flex-1`,
  title: tw`text-xl font-bold text-zinc-900 dark:text-white mb-md text-center`,
  googleButton: tw`w-full bg-zinc-900 dark:bg-white shadow-lg mb-md`,
  googleButtonText: tw`text-white dark:text-zinc-900 font-bold text-lg`,
  appleButton: tw`w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-lg`,
  appleButtonText: tw`text-zinc-900 dark:text-white font-bold text-lg`,
  background: tw`bg-white dark:bg-zinc-900`,
  indicator: tw`bg-zinc-300 dark:bg-zinc-700`,
  loadingOverlay: tw`absolute inset-0 bg-white/80 dark:bg-zinc-900/80 items-center justify-center z-50`,
  spinner: tw`text-zinc-900 dark:text-white`,
};

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
        enablePanDownToClose
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.indicator}
      >
        <BottomSheetView
          style={[styles.content, { paddingBottom: insets.bottom }]}
        >
          <Text style={styles.title}>로그인하고 계속하기</Text>

          <GoogleLoginButton />

          <Button size="large" style={styles.appleButton}>
            <Text style={styles.appleButtonText}>Apple로 시작하기</Text>
          </Button>

          {isLoading && (
            <View style={styles.loadingOverlay}>
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
