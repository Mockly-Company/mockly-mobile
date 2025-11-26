import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/home/HomeScreen';
import { LocalInterviewScreen } from '../screens/localInterview/LocalInterviewScreen';
import { InterviewScreen } from '../screens/interview/InterviewScreen';
import { ChatScreen } from '../screens/chat/ChatScreen';
import { MyPageScreen } from '../screens/profile/MyPageScreen';
import { withScreenErrorBoundary } from '../screens/withScreenErrorBoundary';
import { theme } from '@mockly/design-system';

export type BottomTabParamList = {
  Home: undefined;
  LocalInterview: undefined;
  Interview: undefined;
  Chat: undefined;
  MyPage: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerShown: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={withScreenErrorBoundary(HomeScreen)}
        options={{
          title: '홈',
          tabBarLabel: '홈',
          tabBarAccessibilityLabel: '홈 화면으로 이동',
          tabBarButtonTestID: 'tab-home',
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
        }}
      />
    </Tab.Navigator>
  );
};
