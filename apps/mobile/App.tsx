import { NewAppScreen } from '@react-native/new-app-screen';
import { tw } from '@mockly/design-system';
import { useAppColorScheme, useDeviceContext } from 'twrnc';
import { StatusBar, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  useDeviceContext(tw);
  const [colorScheme] = useAppColorScheme(tw);

  const isDarkMode = colorScheme === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

const containerStyles = tw.style('flex-1');
function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={containerStyles}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

export default App;
