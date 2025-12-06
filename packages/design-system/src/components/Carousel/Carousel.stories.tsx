import type { Meta, StoryObj } from '@storybook/react';
import { View, Text } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { Carousel } from './Carousel';
import { tw } from '../../lib/tw';

const meta: Meta<typeof Carousel> = {
  title: 'Components/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  args: {
    loop: true,
    interaction: 'both',
  },
  argTypes: {
    loop: {
      control: 'boolean',
      description: 'Enable or disable looping of carousel items',
    },
    interaction: {
      control: 'select',
      options: ['swipe', 'tap', 'both'],
      description: 'Type of user interaction to navigate the carousel',
    },
  },
  decorators: [
    (Story, { args }) => {
      return (
        <View style={tw`flex-1 h-20 bg-white dark:bg-zinc-950`}>
          <Story key={`${args.loop}-${args.interaction}`} />
        </View>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const slides = [
  { id: '1', title: 'Slide 1', color: 'bg-blue-500' },
  { id: '2', title: 'Slide 2', color: 'bg-green-500' },
  { id: '3', title: 'Slide 3', color: 'bg-purple-500' },
];

export const Default: Story = {
  render: ({ loop = false, interaction = 'both' }) => {
    const currentIndex = useSharedValue(0);
    const hasReachedEnd = useSharedValue(false);
    return (
      <Carousel
        items={slides}
        renderItem={item => (
          <View style={tw`flex-1 items-center justify-center ${item.color}`}>
            <Text style={tw`text-white text-2xl font-bold`}>{item.title}</Text>
          </View>
        )}
        hasReachedEnd={hasReachedEnd}
        currentIndex={currentIndex}
        loop={loop}
        interaction={interaction}
      />
    );
  },
};

export const TapOnly: Story = {
  render: () => {
    const currentIndex = useSharedValue(0);
    const hasReachedEnd = useSharedValue(false);
    return (
      <Carousel
        items={slides}
        renderItem={item => (
          <View style={tw`flex-1 items-center justify-center ${item.color}`}>
            <Text style={tw`text-white text-2xl font-bold`}>{item.title}</Text>
            <Text style={tw`text-white text-sm mt-2`}>Tap to next</Text>
          </View>
        )}
        currentIndex={currentIndex}
        hasReachedEnd={hasReachedEnd}
        interaction="tap"
      />
    );
  },
};

export const SwipeOnly: Story = {
  render: () => {
    const currentIndex = useSharedValue(0);
    const hasReachedEnd = useSharedValue(false);
    return (
      <Carousel
        items={slides}
        renderItem={item => (
          <View style={tw`flex-1 items-center justify-center ${item.color}`}>
            <Text style={tw`text-white text-2xl font-bold`}>{item.title}</Text>
            <Text style={tw`text-white text-sm mt-2`}>Swipe to navigate</Text>
          </View>
        )}
        currentIndex={currentIndex}
        hasReachedEnd={hasReachedEnd}
        interaction="swipe"
      />
    );
  },
};

export const WithLoop: Story = {
  render: () => {
    const currentIndex = useSharedValue(0);
    const hasReachedEnd = useSharedValue(false);
    return (
      <Carousel
        items={slides}
        renderItem={item => (
          <View style={tw`flex-1 items-center justify-center ${item.color}`}>
            <Text style={tw`text-white text-2xl font-bold`}>{item.title}</Text>
            <Text style={tw`text-white text-sm mt-2`}>Loop enabled</Text>
          </View>
        )}
        currentIndex={currentIndex}
        hasReachedEnd={hasReachedEnd}
        loop={true}
      />
    );
  },
};

export const WithReachedEndTracking: Story = {
  render: () => {
    const currentIndex = useSharedValue(0);
    const hasReachedEnd = useSharedValue(false);
    return (
      <Carousel
        items={slides}
        renderItem={item => (
          <View style={tw`flex-1 items-center justify-center ${item.color}`}>
            <Text style={tw`text-white text-2xl font-bold`}>{item.title}</Text>
            <Text style={tw`text-white text-sm mt-2`}>Tracking end reached</Text>
          </View>
        )}
        currentIndex={currentIndex}
        hasReachedEnd={hasReachedEnd}
      />
    );
  },
};
