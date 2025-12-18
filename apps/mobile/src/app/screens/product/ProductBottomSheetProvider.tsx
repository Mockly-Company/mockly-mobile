import BottomSheet from '@gorhom/bottom-sheet';

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { ProductsScreen } from './ProductScreen';

interface BottomSheetContext {
  expand: () => void;
  close: () => void;
}

const BottomSheetContext = createContext<BottomSheetContext | null>(null);

type BottomSheetProps = PropsWithChildren;

export const ProductBottomSheetProvider = ({ children }: BottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleOpen = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  return (
    <BottomSheetContext.Provider
      value={{ expand: handleOpen, close: handleClose }}
    >
      {children}
      <ProductsScreen bottomSheetRef={bottomSheetRef} />
    </BottomSheetContext.Provider>
  );
};

export const useProductBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('BottomSheet Provider 내부에서 사용해 주세요.');
  }
  return context;
};
