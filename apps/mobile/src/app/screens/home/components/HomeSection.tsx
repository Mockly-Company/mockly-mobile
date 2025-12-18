import { FadeInAnimation, tw } from '@mockly/design-system';
import { ReactNode } from 'react';
import { SectionHeader } from './SectionHeader';
import { View } from 'react-native';

type HomeSectionProps<T> = {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
  items: T[];
  renderItem: (item: T) => ReactNode;
  delay: number;
};

export const HomeSection = <T,>({
  title,
  items,
  renderItem,
  actionLabel,
  onPressAction,
  delay,
}: HomeSectionProps<T>) => {
  return (
    <FadeInAnimation
      style={tw`mb-2xl`}
      direction={'up'}
      delay={delay}
      useSpring={true}
    >
      <SectionHeader
        title={title}
        actionLabel={actionLabel}
        onPressAction={onPressAction}
      />
      <View style={tw`gap-md`}>
        {items.map((item, index) => (
          <FadeInAnimation
            key={`item-${index}`}
            direction={'down'}
            delay={Math.min(delay + index * 50, 600)}
          >
            {renderItem(item)}
          </FadeInAnimation>
        ))}
      </View>
    </FadeInAnimation>
  );
};
