import GoHomeBottomSheet from '@gorhom/bottom-sheet';
import {
  BottomSheetFooter,
  BottomSheetFooterProps,
} from '@gorhom/bottom-sheet';
import { tw } from '@mockly/design-system';
import {
  ComponentType,
  PropsWithChildren,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { BackHandler, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BottomSheetProps = PropsWithChildren<{
  FooterComponent?: ComponentType | ReactNode;
  isClosable: (() => boolean) | boolean;
  ref: RefObject<GoHomeBottomSheet | null>;
}>;

export const BottomSheet = ({
  children,
  isClosable,
  FooterComponent,
  ref,
}: BottomSheetProps) => {
  const isBottomSheetVisible = useRef<boolean>(false);
  const snapPoints = useMemo(() => ['100%'], []);
  const handleClose = useCallback(() => {
    ref.current?.close();
  }, [ref]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      const isOpen = index !== -1;
      isBottomSheetVisible.current = isOpen;
      if (!isOpen && handleClose) {
        handleClose();
      }
    },
    [handleClose],
  );
  // isClosable() === true일 경우에만 닫기 가능. Backhandler에 대한 대응.
  useEffect(() => {
    const handleBackButton = () => {
      let canClose;
      if (typeof isClosable === 'function') {
        canClose = isClosable();
      } else {
        canClose = isClosable;
      }
      if (canClose && isBottomSheetVisible.current) {
        handleClose();
        return true;
      }
      return false;
    };
    const backhandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );

    return () => {
      backhandler.remove();
    };
  }, [handleClose, isClosable]);

  return (
    <GoHomeBottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={false}
      enableHandlePanningGesture={false}
      enableContentPanningGesture={false}
      backgroundStyle={tw`bg-background dark:bg-background-dark rounded-none`}
      handleStyle={tw`rounded-none`}
      handleComponent={null}
      footerComponent={props => (
        <Footer {...props}>
          {typeof FooterComponent === 'function' ? (
            <FooterComponent />
          ) : (
            FooterComponent
          )}
        </Footer>
      )}
    >
      {children}
    </GoHomeBottomSheet>
  );
};

const Footer = ({
  children,
  ...props
}: PropsWithChildren<BottomSheetFooterProps>) => {
  const insets = useSafeAreaInsets();
  return (
    <BottomSheetFooter
      {...props}
      style={tw`pb-[${insets.bottom}] bg-background dark:bg-background-dark`}
    >
      <View
        style={tw`px-4 pb-6 pt-4 w-full
              border-t border-l border-r border-surface dark:border-surface-dark rounded-t-lg`}
      >
        {children}
      </View>
    </BottomSheetFooter>
  );
};
