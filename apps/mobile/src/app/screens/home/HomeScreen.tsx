import { View } from 'react-native';
import { tw, Text, Spacer, SectionHeader } from '@mockly/design-system';
import { useAuth } from '@features/auth/hooks';
import { useInterviewStore } from '@features/interview/store';
import { InterviewCard } from '@app/screens/home/components/InterviewCard';
import { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { FeatureCard } from './components/FeatureCard';
import { StatCard } from './components/StatCard';
import { QuickStartAction } from './components/QuickStartAction';
import { formatMinutesToHoursMinutes } from '@shared/utils/timeFormatter';

export const HomeScreen = () => {
  const { user: _ } = useAuth();
  const { recentLogs } = useInterviewStore();

  const sessions = recentLogs.length;
  const totalMin = recentLogs.reduce(
    (sum, log) => sum + (log.durationMin ?? 0),
    0,
  );
  const avgScore = sessions
    ? Math.round(recentLogs.reduce((s, l) => s + (l.score ?? 0), 0) / sessions)
    : 0;

  return (
    <View style={tw`flex-1`} testID="home-screen">
      <Animated.ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-xl`}
      >
        <Spacer size="lg" />

        {/* Greeting */}
        <Animated.View
          entering={FadeInDown.delay(60).springify()}
          style={tw`mb-md`}
        >
          <Text variant="h2" style={tw`font-bold text-text dark:text-white`}>
            환영합니다!
          </Text>
          <Text
            variant="body"
            style={tw`mt-xs text-text-secondary dark:text-text-secondary-dark`}
          >
            오늘도 면접 준비를 시작해볼까요?
          </Text>
        </Animated.View>

        {/* Stats Row */}
        <Animated.View
          entering={FadeInDown.delay(120).springify()}
          style={tw`mb-xl`}
        >
          <View style={tw`flex-row gap-md`}>
            <View style={tw`flex-1`}>
              <StatCard
                label="연습 횟수"
                value={`${sessions}`}
                color="primary"
              />
            </View>
            <View style={tw`flex-1`}>
              <StatCard
                label="총 시간"
                value={formatMinutesToHoursMinutes(totalMin, 'en')}
                color="success"
              />
            </View>
            <View style={tw`flex-1`}>
              <StatCard
                label="평균 점수"
                value={`${avgScore}`}
                color="secondary"
              />
            </View>
          </View>
        </Animated.View>

        {/* Quick Start */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={tw`mb-xl`}
        >
          <SectionHeader title="빠른 시작" />
          <View style={tw`gap-sm`}>
            <QuickStartAction
              variant="primary"
              title="AI 모의 면접 시작하기"
              subtitle="맞춤형 질문으로 연습해보세요"
            />
            <QuickStartAction
              variant="surface"
              title="이전 면접 다시보기"
              subtitle="피드백을 확인하고 개선하세요"
            />
          </View>
        </Animated.View>

        {/* Feature Sections */}
        <Animated.View
          entering={FadeInUp.delay(300).springify()}
          style={tw`gap-md mb-xl`}
        >
          <SectionHeader title="기능 살펴보기" onPressAction={() => {}} />
          <FeatureCard
            icon="👥"
            title="스터디 파트너 찾기"
            description="함께 모의면접을 진행할 파트너를 매칭해요."
            onPress={() => {
              /* Find Match */
            }}
          />

          <FeatureCard
            icon="👨‍🏫"
            title="전문가 코칭"
            description="전문가에게서 실전 피드백을 받아보세요."
            onPress={() => {
              /* Find Coach */
            }}
          />
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View entering={FadeInUp.delay(400).springify()}>
          <SectionHeader
            title="최근 활동"
            actionLabel="모두 보기"
            onPressAction={() => {}}
          />
        </Animated.View>

        <View style={tw`gap-md`}>
          {recentLogs.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.delay(
                Math.min(500 + index * 100, 1000),
              ).springify()}
            >
              <InterviewCard item={item} />
            </Animated.View>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = {
  container: tw`flex-1 px-lg`,
  content: {
    card: tw`bg-primary/5 border-primary/20 border shadow-sm`,
    container: tw`items-center py-lg px-md`,
    title: tw`text-primary font-bold mb-sm text-2xl`,
    subTitle: tw`text-center mb-lg text-text dark:text-gray-300`,
    button: tw`w-full shadow-md`,
  },
  section: {
    container: tw`mb-xl`,
    title: tw`font-bold text-xl mb-md text-text dark:text-white`,
  },
  recentInterviews: {},
};
