import { NewAppScreen } from '@react-native/new-app-screen';
import { tw } from '@mockly/design-system';
import { useAppColorScheme, useDeviceContext } from 'twrnc';
import { StatusBar, Text, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const testStyles = tw.style('p-4 bg-primary');
function App() {
  useDeviceContext(tw);
  const [colorSchewme] = useAppColorScheme(tw);

  const isDarkMode = colorSchewme === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={testStyles}>
        <Text>Hello, Mockly!</Text>
      </View>

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
