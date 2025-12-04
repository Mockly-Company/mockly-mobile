import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, Text } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { HomeScreen } from '../screens/home/HomeScreen';
import { LocalInterviewScreen } from '../screens/localInterview/LocalInterviewScreen';
import { InterviewScreen } from '../screens/interview/InterviewScreen';
import { ChatScreen } from '../screens/chat/ChatScreen';
import { MyPageScreen } from '../screens/profile/MyPageScreen';
import { withScreenErrorBoundary } from '../screens/withScreenErrorBoundary';
import { theme, tw } from '@mockly/design-system';

export type BottomTabParamList = {
  Home: undefined;
  LocalInterview: undefined;
  Interview: undefined;
  Chat: undefined;
  MyPage: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();
const handleNotifications = () => {
  // TODO: 알림 기능
  console.log('Notifications feature coming soon');
};

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerRight: () => (
          <TouchableOpacity
            style={tw`text-black dark:text-white`}
            onPress={handleNotifications}
          >
            <Feather
              name="bell"
              size={20}
              style={tw`text-black dark:text-white`}
            />
          </TouchableOpacity>
        ),
        headerStyle: tw`h-20`,
        headerRightContainerStyle: tw`pr-md`,
      }}
    >
      <Tab.Screen
        name="Home"
        component={withScreenErrorBoundary(HomeScreen)}
        options={{
          headerTitle: () => (
            <Text style={tw`font-bold text-xl text-zinc-900 dark:text-white`}>
              Mockly
            </Text>
          ),
          headerTitleAlign: 'left',
          tabBarLabel: '홈',
          tabBarAccessibilityLabel: '홈 화면으로 이동',
          tabBarButtonTestID: 'tab-home',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="LocalInterview"
        component={withScreenErrorBoundary(LocalInterviewScreen)}
        options={{
          title: '동네면접',
          tabBarLabel: '동네면접',
          tabBarAccessibilityLabel: '동네면접 화면으로 이동',
          tabBarButtonTestID: 'tab-local-interview',
          tabBarIcon: ({ color, size }) => (
            <Feather name="map-pin" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Interview"
        component={withScreenErrorBoundary(InterviewScreen)}
        options={{
          title: '면접',
          tabBarLabel: '면접',
          tabBarAccessibilityLabel: '면접 화면으로 이동',
          tabBarButtonTestID: 'tab-interview',
          tabBarIcon: ({ color, size }) => (
            <Feather name="video" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={withScreenErrorBoundary(ChatScreen)}
        options={{
          title: '채팅',
          tabBarLabel: '채팅',
          tabBarAccessibilityLabel: '채팅 화면으로 이동',
          tabBarButtonTestID: 'tab-chat',
          tabBarIcon: ({ color, size }) => (
            <Feather name="message-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={withScreenErrorBoundary(MyPageScreen)}
        options={{
          title: '마이페이지',
          tabBarLabel: '마이페이지',
          tabBarAccessibilityLabel: '마이페이지 화면으로 이동',
          tabBarButtonTestID: 'tab-mypage',
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
