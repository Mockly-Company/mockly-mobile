import { View } from 'react-native';
import { tw, Text, Card, Progress } from '@mockly/design-system';
import { useQuery } from '@tanstack/react-query';
import { queries } from '@shared/api/QueryKeys';

type TokenUsageCardProps = {
  userId: string;
};

export function TokenUsageCard({ userId }: TokenUsageCardProps) {
  const { data: subscription } = useQuery(queries.subscription.detail(userId));

  const usage = subscription?.usage || 0;
  const limit = subscription?.limit || 0;
  const usagePercent = Math.min(Math.floor((usage / limit) * 100), 100);
  return (
    <Card style={tw`p-4 mb-4 w-full`}>
      <Header title="이번달 토큰 사용량" usage={usage} limit={limit} />

      <Progress value={usage} max={limit}>
        <Progress.Bar />
      </Progress>

      <Text variant="caption" style={tw`text-gray-600`}>
        {usagePercent.toFixed(0)}% 사용 중
      </Text>
    </Card>
  );
}
type HeaderProps = {
  title: string;
  usage: number;
  limit: number;
};
const Header = ({ title, usage, limit }: HeaderProps) => {
  return (
    <View style={tw`flex-row justify-between items-center mb-3`}>
      <Text variant="h4">{title}</Text>
      <Text variant="body" style={tw`text-gray-600`}>
        {formatNumberTo만단위(usage)} / {formatNumberTo만단위(limit)}
      </Text>
    </View>
  );
};

const formatNumberTo만단위 = (num: number) => {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}만`;
  }
  return num.toLocaleString();
};
