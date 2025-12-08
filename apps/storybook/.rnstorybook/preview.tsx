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
          '디자인 시스템',
          ['디자인 시스템'],
          '파운데이션',
          ['파운데이션 소개'],
          '스크린',
          ['스크린 소개'],
          '컴포넌트',
          ['컴포넌트 소개'],
          '레이아웃',
          ['레이아웃 소개'],
          '애니메이션',
          ['애니메이션 소개'],
        ],
      },
    },
  },
};

export default preview;
