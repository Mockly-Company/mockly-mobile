import { View } from 'react-native';
import { tw, Text, Spacer, Icon } from '@mockly/design-system';
import { PlanType, PLAN_FEATURES, PaymentService } from '@mockly/domain';

interface PlanDetailProps {
  planType: PlanType | null;
}

export function ProductDetail({ planType }: PlanDetailProps) {
  if (!planType) return <NoSelectedProductDetail />;

  const planDetails = PLAN_FEATURES[planType];

  return (
    <View style={tw`py-6`}>
      <Spacer size="sm" />
      <ProductUsageLimit
        monthlyTokenLimit={planDetails.monthlyTokenLimit}
        dailyInterviewLimit={planDetails.dailyInterviewLimit}
      />
      <ProductFeatureList features={planDetails.displayFeatures} />
    </View>
  );
}

const NoSelectedProductDetail = () => {
  return (
    <View style={tw`py-8 items-center`}>
      <Text variant="body" style={tw`text-gray-400 text-center`}>
        플랜을 선택하면 상세 내용을 확인할 수 있습니다
      </Text>
    </View>
  );
};

const ProductUsageLimit = ({
  monthlyTokenLimit,
  dailyInterviewLimit,
}: {
  monthlyTokenLimit: number;
  dailyInterviewLimit: number | null;
}) => {
  const monthlyTokenLimitDisplay =
    PaymentService.formatAmount(monthlyTokenLimit);
  const dailyInterviewLimitDisplay =
    dailyInterviewLimit === null ? '무제한' : `${dailyInterviewLimit}회`;

  return (
    <View style={tw`mb-6`}>
      <View style={tw`flex-row items-center mb-3`}>
        <Icon name="zap" size={20} variant={'secondary'} />
        <Text variant="body" color="text" style={tw`ml-2 font-semibold`}>
          사용 한도
        </Text>
      </View>
      <View style={tw`pl-7`}>
        <Text variant="body" color="textSecondary" style={tw`mb-1`}>
          • 월 토큰: {monthlyTokenLimitDisplay}
        </Text>
        <Text variant="body" color="textSecondary">
          • 일일 면접: {dailyInterviewLimitDisplay}
        </Text>
      </View>
    </View>
  );
};

const ProductFeatureList = ({ features }: { features: string[] }) => {
  return (
    <View style={tw`mb-4`}>
      <View style={tw`flex-row items-center mb-3`}>
        <Icon name="star" size={20} variant={'primary'} />
        <Text variant="body" color="text" style={tw`ml-2 font-semibold`}>
          포함된 기능
        </Text>
      </View>
      <View style={tw`pl-7`}>
        {features.map((feature, index) => (
          <View key={index} style={tw`flex-row items-start mb-2`}>
            <Icon
              name="check-circle"
              size={16}
              variant={'success'}
              style={tw`mt-0.5`}
            />
            <Text variant="body" color="textSecondary" style={tw`ml-2 flex-1`}>
              {feature}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
