import { tw } from '@mockly/design-system';
import { View } from 'react-native';
import { ProductCard } from './ProductList.Card';
import { PaidPlanType, PlanType } from '@mockly/domain';

import { PropsWithChildren } from 'react';

const PLAN_TYPES: PaidPlanType[] = [
  PlanType.enum.Basic,
  PlanType.enum.Pro,
  PlanType.enum.Premium,
];

export const ProductList = ({
  selectedType,
  onSelect,
  usingPlanType,
}: {
  selectedType: PaidPlanType | null;
  onSelect: (planType: PaidPlanType) => void;
  usingPlanType: PlanType | null;
}) => {
  return (
    <ProductCardList>
      {PLAN_TYPES.map(planType => (
        <ProductCard
          key={planType}
          planType={planType}
          isSelected={selectedType === planType}
          isCurrent={usingPlanType === planType}
          onSelect={onSelect}
        />
      ))}
    </ProductCardList>
  );
};

const ProductCardList = ({ children }: PropsWithChildren) => {
  return <View style={tw`flex-row gap-3 mb-2`}>{children}</View>;
};
