import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { tw, Text, Spacer, FadeInAnimation } from '@mockly/design-system';
import { useInterviewStore } from '@features/interview/store';

import { InterviewCard } from '@app/screens/home/components/InterviewCard';
import { FeatureCard } from './components/FeatureCard';
import { StatCard } from './components/StatCard';
import { QuickStartAction } from './components/QuickStartAction';
import { formatMinutesToHoursMinutes } from '@shared/utils/timeFormatter';
import { UpgradeBanner } from './components/UpgradeBanner';
import { TokenUsageCard } from '@features/subscription';
import { useUserProfile } from '@features/user';
import { PlanType } from '@mockly/domain';
import { HomeSection } from './components/HomeSection';

export const HomeScreen = () => {
  const { recentLogs } = useInterviewStore();
  const { user, subscription } = useUserProfile();

  const sessionCount = recentLogs.length;
  const totalMin = recentLogs.reduce(
    (sum, log) => sum + (log.durationMin ?? 0),
    0,
  );
  const avgScore = sessionCount
    ? Math.round(
        recentLogs.reduce((s, l) => s + (l.score ?? 0), 0) / sessionCount,
      )
    : 0;

  const { planType } = subscription;
  const notPremium = planType !== 'PREMIUM';

  return (
    <View style={tw`flex-1`} testID="home-screen">
      <Animated.ScrollView
        style={tw`flex-1 px-lg`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-xl`}
      >
        <Spacer size="lg" />

        <GreetingHeader
          title="환영합니다!"
          subTitle="오늘도 면접 준비를 시작해볼까요?"
        />

        <UserDashboard
          sessionCount={sessionCount}
          totalTimeInMin={totalMin}
          averageScore={avgScore}
        />

        {notPremium && <PlanUpgradePromotion currentPlan={planType} />}

        <TokenUsageCard userId={user.id} />

        <HomeSection
          title="빠른 시작"
          items={QUICKS}
          renderItem={item => (
            <QuickStartAction
              variant={item.variant}
              title={item.title}
              subtitle={item.subTitle}
            />
          )}
          delay={300}
        />

        <HomeSection
          title="기능 살펴보기"
          items={FEATURES}
          renderItem={item => (
            <FeatureCard
              icon={item.icon}
              title={item.title}
              description={item.description}
              onPress={() => {}}
            />
          )}
          delay={300}
        />

        {/* Recent Activity */}
        <HomeSection
          title="최근활동"
          actionLabel="모두 보기"
          onPressAction={() => {}}
          items={recentLogs}
          renderItem={item => <InterviewCard item={item} />}
          delay={400}
        />
      </Animated.ScrollView>
    </View>
  );
};

type GreetingHeaderProps = {
  title: string;
  subTitle: string;
};
const GreetingHeader = ({ title, subTitle }: GreetingHeaderProps) => {
  return (
    <FadeInAnimation
      direction={'down'}
      delay={60}
      style={tw`mb-md`}
      useSpring={true}
    >
      <Text variant="h2" style={tw`font-bold text-text dark:text-white`}>
        {title}
      </Text>
      <Text
        variant="body"
        style={tw`mt-xs text-text-secondary dark:text-text-secondary-dark`}
      >
        {subTitle}
      </Text>
    </FadeInAnimation>
  );
};

type UserDashboardProps = {
  sessionCount: number;
  totalTimeInMin: number;
  averageScore: number;
};
const UserDashboard = ({
  sessionCount,
  totalTimeInMin,
  averageScore,
}: UserDashboardProps) => {
  return (
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
            value={`${sessionCount}`}
            color="primary"
          />
        </View>
        <View style={tw`flex-1`}>
          <StatCard
            label="총 시간"
            value={formatMinutesToHoursMinutes(totalTimeInMin, 'en')}
            color="success"
          />
        </View>
        <View style={tw`flex-1`}>
          <StatCard
            label="평균 점수"
            value={`${averageScore}`}
            color="secondary"
          />
        </View>
      </View>
    </FadeInAnimation>
  );
};

type PlanUpgradePromotionProps = { currentPlan: Exclude<PlanType, 'PREMIUM'> };
const PlanUpgradePromotion = ({ currentPlan }: PlanUpgradePromotionProps) => {
  return (
    <FadeInAnimation
      direction={'down'}
      delay={180}
      style={tw`mb-xl`}
      useSpring={true}
    >
      <UpgradeBanner currentPlan={currentPlan} />
    </FadeInAnimation>
  );
};

const QUICKS: {
  variant: 'primary' | 'surface';
  title: string;
  subTitle: string;
}[] = [
  {
    variant: 'primary',
    title: 'AI 모의 면접 시작하기',
    subTitle: '맞춤형 질문으로 연습해보세요',
  },
  {
    variant: 'surface',
    title: '이전 면접 다시보기',
    subTitle: '피드백을 확인하고 개선하세요',
  },
];

const FEATURES = [
  {
    icon: '👥',
    title: '스터디 파트너 찾기',
    description: '함께 모의면접을 진행할 파트너를 매칭해요.',
    routePath: 'partner',
  },
  {
    icon: '👨‍🏫',
    title: '전문가 코칭',
    description: '전문가에게서 실전 피드백을 받아보세요.',
    routePath: 'coach',
  },
];
