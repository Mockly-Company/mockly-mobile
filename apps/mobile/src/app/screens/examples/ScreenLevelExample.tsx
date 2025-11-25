/**
 * Screen 레벨 ErrorBoundary 예시
 *
 * 화면 전체를 표시하기 위한 필수 데이터를 다룹니다.
 * 에러 발생 시 화면 전체가 에러 UI로 대체됩니다.
 */

import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { tw } from '@mockly/design-system';
import { ScreenErrorBoundary } from '@shared/errors/boundaries';

// ===== Mock API =====
interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
}

async function fetchUserProfile(userId: string): Promise<UserProfile> {
  // 실제로는 API 호출
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error('사용자 정보를 불러올 수 없습니다');
  return response.json();
}

// ===== Hook =====
function useUserProfile(userId: string) {
  return useQuery<UserProfile>({
    queryKey: ['user', 'profile', userId],
    queryFn: () => fetchUserProfile(userId),
    // ✨ 에러를 ErrorBoundary로 전파
    throwOnError: true,
    // 기본 옵션
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 30, // 30분 (v5에서 cacheTime → gcTime)
  });
}

// ===== Screen Content =====
function ProfileScreenContent({ userId }: { userId: string }) {
  const { data, isLoading } = useUserProfile(userId);

  if (isLoading || !data) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <ActivityIndicator size="large" />
        <Text style={tw`mt-4 text-gray-600`}>프로필 로딩 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-white`}>
      <View style={tw`p-6`}>
        {/* 프로필 이미지 영역 */}
        <View style={tw`items-center mb-6`}>
          <View
            style={tw`w-24 h-24 bg-primary rounded-full items-center justify-center`}
          >
            <Text style={tw`text-3xl text-white font-bold`}>
              {data.name.charAt(0)}
            </Text>
          </View>
        </View>

        {/* 사용자 정보 */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-2xl font-bold text-gray-900 mb-2 text-center`}>
            {data.name}
          </Text>
          <Text style={tw`text-base text-gray-600 text-center mb-4`}>
            {data.email}
          </Text>
        </View>

        {/* 자기소개 */}
        <View style={tw`bg-gray-50 p-4 rounded-lg`}>
          <Text style={tw`text-sm font-semibold text-gray-700 mb-2`}>
            자기소개
          </Text>
          <Text style={tw`text-base text-gray-900`}>{data.bio}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

// ===== Screen (with ErrorBoundary) =====
interface Props {
  userId: string;
}

export function ProfileScreenExample({ userId }: Props) {
  return (
    <ScreenErrorBoundary screenName="프로필">
      <ProfileScreenContent userId={userId} />
    </ScreenErrorBoundary>
  );
}

/**
 * 사용 예시:
 *
 * import { ProfileScreenExample } from './examples/ScreenLevelExample';
 *
 * function MyNavigator() {
 *   return (
 *     <Stack.Navigator>
 *       <Stack.Screen
 *         name="Profile"
 *         component={ProfileScreenExample}
 *       />
 *     </Stack.Navigator>
 *   );
 * }
 */
