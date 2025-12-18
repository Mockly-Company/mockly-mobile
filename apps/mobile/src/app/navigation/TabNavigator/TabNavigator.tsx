import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pressable, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { HomeScreen } from '../../screens/home/HomeScreen';
import { LocalInterviewScreen } from '../../screens/localInterview/LocalInterviewScreen';
import { InterviewScreen } from '../../screens/interview/InterviewScreen';
import { ChatScreen } from '../../screens/chat/ChatScreen';
import { MyPageScreen } from '../../screens/profile/MyPageScreen';
import { UpgradeButton } from '../../components/UpgradeButton/UpgradeButton';
import { theme, tw, Text, Icon } from '@mockly/design-system';

import { TabParamList } from '../types';
import { useProductBottomSheet } from '@app/screens/product/ProductBottomSheetProvider';

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator = () => {
  const { expand: handleOpenProductsSheet } = useProductBottomSheet();

  const handleNotifications = () => {
    // TODO: 알림 기능
    console.log('Notifications feature coming soon');
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerRight: () => (
          <View style={tw`flex-row items-center gap-3`}>
            <UpgradeButton onPress={handleOpenProductsSheet} />
            <Pressable onPress={handleNotifications}>
              <Icon name="bell" size={20} variant={'text'} />
            </Pressable>
          </View>
        ),
        headerStyle: tw`h-20`,
        headerRightContainerStyle: tw`pr-md`,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: () => <Text variant="h2">Mockly</Text>,
          headerTitleAlign: 'left',
          tabBarLabel: '홈',
          tabBarAccessibilityLabel: '홈 화면으로 이동',
          tabBarButtonTestID: 'tab-home',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="LocalInterview"
        component={LocalInterviewScreen}
        options={{
          title: '동네면접',
          tabBarLabel: '동네면접',
          tabBarAccessibilityLabel: '동네면접 화면으로 이동',
          tabBarButtonTestID: 'tab-local-interview',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Feather name="map-pin" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Interview"
        component={InterviewScreen}
        options={{
          title: '면접',
          tabBarLabel: '면접',
          tabBarAccessibilityLabel: '면접 화면으로 이동',
          tabBarButtonTestID: 'tab-interview',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Feather name="video" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: '채팅',
          tabBarLabel: '채팅',
          tabBarAccessibilityLabel: '채팅 화면으로 이동',
          tabBarButtonTestID: 'tab-chat',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Feather name="message-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          title: '마이페이지',
          tabBarLabel: '마이페이지',
          tabBarAccessibilityLabel: '마이페이지 화면으로 이동',
          tabBarButtonTestID: 'tab-mypage',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
