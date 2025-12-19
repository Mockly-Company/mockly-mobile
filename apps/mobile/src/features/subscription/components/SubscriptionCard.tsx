import { View } from 'react-native';
import { tw, Text, Card, Badge } from '@mockly/design-system';
import { PlanType, ProductService } from '@mockly/domain';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { queries } from '@configs/queryClient/QueryKeys';

type SubscriptionCardProps = {
  userId: string;
};

export function SubscriptionCard({ userId }: SubscriptionCardProps) {
  const { data: subscription } = useQuery(queries.subscription.detail(userId));

  return (
    <Card style={tw`p-4`}>
      <Header title="현재 구독" planType={subscription?.planType} />
      <DateDisplay title="시작일" date={subscription?.startedAt} />
      <DateDisplay title="만료일" date={subscription?.expiresAt} />
    </Card>
  );
}

type HeaderProps = {
  title: string;
  planType?: PlanType;
};

const Header = ({ title, planType }: HeaderProps) => {
  const isPaid = planType !== 'FREE';
  return (
    <View style={tw`flex-row justify-between items-center mb-3`}>
      <Text variant="h3">{title}</Text>
      <View style={tw`flex-row gap-1 items-center`}>
        <Badge color={isPaid ? 'success' : 'neutral'}>
          {planType ? ProductService.getPlanName(planType) : '-'}
        </Badge>
      </View>
    </View>
  );
};

type DateDisplayProps = {
  title: string;
  date?: Date | null;
};

const DateDisplay = ({ title, date }: DateDisplayProps) => {
  return (
    <View
      style={tw`flex-row justify-between items-center py-2 border-b border-gray-200`}
    >
      <Text variant="body" style={tw`text-gray-600`}>
        {title}
      </Text>
      <Text variant="body">
        {date ? dayjs(date).format('YYYY. MM. DD') : '-'}
      </Text>
    </View>
  );
};
