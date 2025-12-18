import { Icon, Text, tw } from '@mockly/design-system';
import { PlanType } from '@mockly/domain';
import { View } from 'react-native';

type SummaryConfig = {
  title: string;
  description: string;
  theme: {
    bg: string;
    border: string;
    titleColor: string;
    descColor: string;
  };
};

export const ProductSummary = ({ planType }: { planType: PlanType | null }) => {
  if (!planType) return null;

  const config = summaryConfigs[planType];
  if (!config) return null;

  return (
    <View
      style={tw`${config.theme.bg} border ${config.theme.border} rounded-lg p-4 mb-4`}
    >
      <View style={tw`flex-row items-center mb-2`}>
        <Icon name="award" size={18} variant={'primary'} />
        <Text
          variant="body"
          style={tw`ml-2 font-bold ${config.theme.titleColor}`}
        >
          {config.title}
        </Text>
      </View>
      <Text variant="caption" style={tw`${config.theme.descColor}`}>
        {config.description}
      </Text>
    </View>
  );
};

const summaryConfigs: Record<string, SummaryConfig> = {
  BASIC: {
    title: '시작하기',
    description:
      '기본 기능으로 면접 준비를 시작해보세요. 무료로 제공되는 핵심 기능을 경험할 수 있습니다.',
    theme: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      titleColor: 'text-blue-700',
      descColor: 'text-blue-600',
    },
  },
  PRO: {
    title: '추천 플랜',
    description:
      '가장 많은 사용자가 선택한 플랜입니다. 전문가 프로필과 우선 매칭으로 효과적인 면접 준비를 경험하세요.',
    theme: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      titleColor: 'text-purple-700',
      descColor: 'text-purple-600',
    },
  },
  PREMIUM: {
    title: '프리미엄 혜택',
    description:
      'AI 맞춤 학습과 이력서 리뷰까지! 완벽한 면접 준비를 위한 올인원 패키지입니다.',
    theme: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      titleColor: 'text-orange-700',
      descColor: 'text-orange-600',
    },
  },
};
