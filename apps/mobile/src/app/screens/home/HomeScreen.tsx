import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { tw, Text, Spacer, FadeInAnimation } from '@mockly/design-system';
import { useInterviewStore } from '@features/interview/store';
import { InterviewCard } from '@app/screens/home/components/InterviewCard';
import { FeatureCard } from './components/FeatureCard';
import { StatCard } from './components/StatCard';
import { QuickStartAction } from './components/QuickStartAction';
import { formatMinutesToHoursMinutes } from '@shared/utils/timeFormatter';
import { SectionHeader } from './components/SectionHeader';

export const HomeScreen = () => {
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
        style={tw`flex-1 px-lg`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-xl`}
      >
        <Spacer size="lg" />

        {/* Greeting */}
        <FadeInAnimation
          direction={'down'}
          delay={60}
          style={tw`mb-md`}
          useSpring={true}
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
        </FadeInAnimation>

        {/* Stats Row */}

        <FadeInAnimation
          direction={'down'}
          delay={120}
          style={tw`mb-xl`}
          useSpring={true}
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
        </FadeInAnimation>

        {/* Quick Start */}
        <FadeInAnimation
          direction={'down'}
          delay={200}
          style={tw`mb-xl`}
          useSpring={true}
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
        </FadeInAnimation>

        {/* Feature Sections */}
        <FadeInAnimation
          direction={'up'}
          delay={300}
          style={tw`gap-md mb-xl`}
          useSpring={true}
        >
          <SectionHeader title="기능 살펴보기" />
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
        </FadeInAnimation>

        {/* Recent Activity */}
        <FadeInAnimation direction={'up'} delay={400} useSpring={true}>
          <SectionHeader
            title="최근 활동"
            actionLabel="모두 보기"
            onPressAction={() => {}}
          />
        </FadeInAnimation>
        <View style={tw`gap-md`}>
          {recentLogs.map((item, index) => (
            <FadeInAnimation
              key={item.id}
              direction={'down'}
              delay={Math.min(500 + index * 80, 900)}
            >
              <InterviewCard item={item} />
            </FadeInAnimation>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
};
