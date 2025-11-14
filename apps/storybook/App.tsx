import './global.css';
import StorybookUI from './.rnstorybook'; // ✅ Safe! Metro stubs this out when enabled: false
// import {Text, View} from 'react-native';

// const isStorybook = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

// this could be your app entrypoint
// const AppComponent = () => {
//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <Text>Hello World</Text>
//     </View>
//   );
// };

export default function App() {
  return <StorybookUI />;
  // return isStorybook ? <StorybookUI /> : <AppComponent />;
}
