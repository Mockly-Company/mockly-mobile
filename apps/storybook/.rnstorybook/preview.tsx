import {type Preview} from '@storybook/react-native';
import {View} from 'react-native';
import {withBackgrounds} from '@storybook/addon-ondevice-backgrounds';

const preview: Preview = {
  decorators: [
    withBackgrounds,
    Story => (
      //ts-ignore
      <View style={{flex: 1}}>
        <Story />
      </View>
    ),
  ],
  parameters: {
    backgrounds: {
      default: 'plain',
      values: [
        {name: 'plain', value: 'white'},
        {name: 'dark', value: 'black'},
      ],
    },
    actions: {argTypesRegex: '^on[A-Z].*'},
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          'Welcome',
          ['디자인 시스템'],
          'Foundation',
          ['파운데이션 소개'],
          'Components',
          ['컴포넌트 소개'],
          'Layout',
          ['레이아웃 소개'],
          'Animations',
          ['애니메이션 소개'],
        ],
      },
    },
  },
};

export default preview;
