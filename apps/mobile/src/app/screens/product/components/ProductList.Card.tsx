import { TouchableOpacity, View } from 'react-native';
import { tw, Text, Badge } from '@mockly/design-system';
import { cva } from 'cva';
import {
  PlanType,
  PLAN_FEATURES,
  PaymentService,
  PaidPlanType,
} from '@mockly/domain';
import React from 'react';

interface ProductCardProps {
  planType: PaidPlanType;
  isSelected: boolean;
  isCurrent: boolean;
  onSelect: (planType: PaidPlanType) => void;
}

const productCardVariants = cva({
  base: 'bg-surface dark:bg-surface-dark border-gray-300',
  variants: {
    isSelected: {
      true: 'border-primary',
      false: '',
    },
    isCurrent: {
      true: 'bg-green-300',
      false: '',
    },
  },
  defaultVariants: {
    isSelected: false,
    isCurrent: false,
  },
});

export const ProductCard = React.memo(
  ({ planType, isSelected, isCurrent, onSelect }: ProductCardProps) => {
    const planDetails = PLAN_FEATURES[planType];
    const isRecommendedProduct = planType === PlanType.enum.Pro;

    return (
      <TouchableOpacity
        onPress={() => onSelect(planType)}
        activeOpacity={0.7}
        disabled={isCurrent}
        style={tw.style('flex-1', isCurrent && 'opacity-60')}
      >
        <View
          style={tw.style(
            'relative border-2 rounded-xl py-4 px-1 items-center',
            productCardVariants({ isSelected, isCurrent }),
          )}
        >
          {!isCurrent && isRecommendedProduct && (
            <Badge
              variant="solid"
              color="success"
              size="sm"
              style={tw`absolute -top-2`}
            >
              추천
            </Badge>
          )}

          {isCurrent && (
            <Badge
              variant="solid"
              color="success"
              size="sm"
              style={tw`absolute -top-2`}
            >
              현재
            </Badge>
          )}
          <Text
            variant="h4"
            color="text"
            style={tw`font-bold mb-1 text-center`}
          >
            {planDetails.name}
          </Text>
          <Text
            variant="body"
            color="primary"
            weight="bold"
            style={tw`text-center`}
          >
            {planDetails.price === 0
              ? '무료'
              : `${PaymentService.formatAmount(planDetails.price)}`}
          </Text>
          <Text variant="caption" color="textSecondary" style={tw`text-center`}>
            / 월
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
);
ProductCard.displayName = 'ProductCard';
