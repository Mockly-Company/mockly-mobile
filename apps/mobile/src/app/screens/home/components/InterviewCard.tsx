import { Card, Text, tw, Badge } from '@mockly/design-system';
import {
  relativeTimeFromNow,
  formatMinutesToHoursMinutes,
} from '@utils/timeFormatter';
import { View } from 'react-native';
import { InterviewLog } from '../../../../features/interview/store';
import { PropsWithChildren } from 'react';
type InterviewCardProps = {
  item: InterviewLog;
};

export const InterviewCard = ({ item }: InterviewCardProps) => {
  const relative = relativeTimeFromNow(item.date);
  const formattedDuration = formatMinutesToHoursMinutes(item.durationMin);
  const accessibilityLabel = `${item.title}. ${formattedDuration ? `${relative}, ${formattedDuration}` : relative}. 점수 ${item.score}점`;
  return (
    <Card
      variant="elevated"
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="면접 기록 상세 화면으로 이동합니다"
    >
      <View style={tw`flex-row justify-between items-center py-sm px-md`}>
        <View>
          <Title>{item.title}</Title>
          <MetaInfo>{`${relative} · ${formattedDuration} 소요`}</MetaInfo>
        </View>
        <Badge variant="soft" color={'success'} size="sm">
          {item.score}점
        </Badge>
      </View>
    </Card>
  );
};

const Title = ({ children }: PropsWithChildren) => {
  return (
    <Text variant="body" style={tw`font-bold text-text dark:text-white`}>
      {children}
    </Text>
  );
};

const MetaInfo = ({ children }: PropsWithChildren) => {
  return (
    <Text variant="caption" color="textSecondary">
      {children}
    </Text>
  );
};
