import type { Meta, StoryObj } from '@storybook/react';
import { View, Text } from 'react-native';

const WelcomeComponent = () => {
  return (
    <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        Welcome to Mockly Storybook
      </Text>
      <Text style={{ fontSize: 16, color: '#666' }}>Design System Documentation</Text>
    </View>
  );
};

const meta: Meta<typeof WelcomeComponent> = {
  title: 'Welcome',
  component: WelcomeComponent,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof WelcomeComponent>;

export const Default: Story = {};
