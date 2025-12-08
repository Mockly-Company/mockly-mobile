import { Card, Text, tw, Badge } from '@mockly/design-system';
import {
  relativeTimeFromNow,
  formatMinutesToHoursMinutes,
} from '@shared/utils/timeFormatter';
import { View } from 'react-native';
import { InterviewLog } from '../../../../features/interview/store';
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
          <Text variant="body" style={tw`font-bold text-text dark:text-white`}>
            {item.title}
          </Text>
          <Text
            variant="caption"
            style={tw`text-text-secondary dark:text-text-secondary-dark`}
          >
            {`${relative} · ${formattedDuration} 소요`}
          </Text>
        </View>
        <ScoreBadge score={item.score} color="success" />
      </View>
    </Card>
  );
};

// 추후 점수별 색상 변경 로직이 생길 수 있어서 별도로 분리해둠.
const ScoreBadge = ({
  score,
  color,
}: {
  score: number;
  color: 'primary' | 'success' | 'warning' | 'neutral';
}) => (
  <Badge variant="soft" color={color} size="sm">
    {score}점
  </Badge>
);
