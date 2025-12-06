import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { View } from 'react-native';
import { useState } from 'react';
import { tw } from '../../lib/tw';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Input label',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
  decorators: [
    Story => (
      <View style={tw`p-5 w-75 bg-white dark:bg-gray-900`}>
        <Story />
      </View>
    ),
  ],
} as Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'name@example.com',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'name@example.com',
    error: 'Please enter a valid email address',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'Cannot edit',
    editable: false,
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    secureTextEntry: true,
  },
};

export const Interactive: Story = {
  render: args => {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    const handleChange = (text: string) => {
      setValue(text);
      if (text.length < 3) {
        setError('Must be at least 3 characters');
      } else {
        setError('');
      }
    };

    return (
      <Input
        {...args}
        label="Username"
        placeholder="Enter username"
        value={value}
        onChangeText={handleChange}
        error={error}
      />
    );
  },
};
