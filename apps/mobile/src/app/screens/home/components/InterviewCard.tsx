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
      style={styles.card}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="면접 기록 상세 화면으로 이동합니다"
    >
      <View style={styles.container}>
        <View>
          <Text variant="body" style={styles.title}>
            {item.title}
          </Text>
          <Text variant="caption" style={styles.date}>
            {`${relative} · ${formattedDuration} 소요`}
          </Text>
        </View>
        <ScoreBadge score={item.score} color="success" />
      </View>
    </Card>
  );
};

const styles = {
  card: tw`bg-surface dark:bg-surface-dark`,
  container: tw`flex-row justify-between items-center py-sm px-md`,
  title: tw`font-bold text-text dark:text-white`,
  date: tw`text-text-secondary dark:text-text-secondary-dark`,
  scoreContainer: tw`px-sm py-xs rounded-full bg-primary/10 border border-primary/20`,
  scoreText: tw`text-primary font-bold`,
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
