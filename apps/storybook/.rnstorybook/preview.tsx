import '../global.css';
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
        {name: 'warm', value: 'hotpink'},
        {name: 'cool', value: 'deepskyblue'},
      ],
    },
  },
};

export default preview;
