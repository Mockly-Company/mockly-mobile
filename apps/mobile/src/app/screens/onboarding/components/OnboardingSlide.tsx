import { FadeInTextAnimation, tw } from '@mockly/design-system';
import { View } from 'react-native';

interface OnboardingSlideProps {
  title: string;
  description: string;
}

export const OnboardingSlide = ({
  title,
  description,
}: OnboardingSlideProps) => {
  return (
    <View
      style={tw`flex-1 items-center justify-center px-6`}
      accessible={true}
      accessibilityLabel={`onboarding-slide-${title}`}
    >
      <FadeInTextAnimation
        direction="down"
        delay={200}
        useSpring={true}
        style={tw`text-4xl font-extrabold text-zinc-900 dark:text-white text-center`}
      >
        {title}
      </FadeInTextAnimation>
      <FadeInTextAnimation
        direction="down"
        delay={300}
        useSpring={true}
        style={tw`mt-3 text-lg text-zinc-600 dark:text-zinc-300 text-center`}
      >
        {description}
      </FadeInTextAnimation>
    </View>
  );
};
