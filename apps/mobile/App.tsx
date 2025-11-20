import { tw } from '@mockly/design-system';
import { useAppColorScheme, useDeviceContext } from 'twrnc';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabNavigator } from './src/app/navigation/BottomTabNavigator';

function App() {
  useDeviceContext(tw);
  const [colorScheme] = useAppColorScheme(tw);

  const isDarkMode = colorScheme === 'dark';

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <BottomTabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
