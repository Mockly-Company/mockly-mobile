/**
 * Component 레벨 ErrorBoundary 예시
 *
 * 옵셔널한 데이터(추천 게시글, 광고 등)를 다룹니다.
 * 에러 발생 시 해당 컴포넌트만 에러 UI로 대체되고, 다른 부분은 정상 표시됩니다.
 */

import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { tw } from '@mockly/design-system';
import { ComponentErrorBoundary } from '@shared/errors/boundaries';

// ===== Mock API =====
interface Post {
  id: string;
  title: string;
  excerpt: string;
  author: string;
}

interface Activity {
  description: string;
}

async function fetchRecommendedPosts(): Promise<Post[]> {
  const response = await fetch('/api/posts/recommended');
  if (!response.ok) throw new Error('추천 게시글을 불러올 수 없습니다');
  return response.json();
}

async function fetchUserActivity(): Promise<Activity[]> {
  const response = await fetch('/api/user/activity');
  if (!response.ok) {
    // 404는 빈 배열 반환
    if (response.status === 404) return [];
    throw new Error('활동 내역을 불러올 수 없습니다');
  }
  return response.json();
}

// ===== Component 1: Recommended Posts =====
function RecommendedPostsContent() {
  const { data, isLoading } = useQuery<Post[]>({
    queryKey: ['posts', 'recommended'],
    queryFn: fetchRecommendedPosts,
    // ✨ ErrorBoundary로 에러 전파
    throwOnError: true,
    staleTime: 1000 * 60 * 10, // 10분
  });

  if (isLoading || !data) {
    return (
      <View style={tw`p-4 items-center`}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <View>
      {data.map(post => (
        <TouchableOpacity
          key={post.id}
          style={tw`p-4 mb-2 bg-white rounded-lg border border-gray-200`}
        >
          <Text style={tw`text-base font-semibold text-gray-900 mb-1`}>
            {post.title}
          </Text>
          <Text style={tw`text-sm text-gray-600 mb-2`} numberOfLines={2}>
            {post.excerpt}
          </Text>
          <Text style={tw`text-xs text-gray-500`}>by {post.author}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export function RecommendedPosts() {
  return (
    <ComponentErrorBoundary>
      <RecommendedPostsContent />
    </ComponentErrorBoundary>
  );
}

// ===== Component 2: User Activity (with custom error handling) =====
function UserActivityContent() {
  const { data, isLoading } = useQuery({
    queryKey: ['user', 'activity'],
    queryFn: fetchUserActivity,
    throwOnError: true,
    retry: 1, // 1번만 재시도
  });

  if (isLoading) {
    return (
      <View style={tw`p-4 items-center`}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={tw`p-6 items-center`}>
        <Text style={tw`text-sm text-gray-500`}>활동 내역이 없습니다</Text>
      </View>
    );
  }

  return (
    <View>
      {data.map((activity, index) => (
        <View key={index} style={tw`p-3 mb-2 bg-gray-50 rounded-lg`}>
          <Text style={tw`text-sm text-gray-700`}>{activity.description}</Text>
        </View>
      ))}
    </View>
  );
}

export function UserActivity() {
  return (
    <ComponentErrorBoundary>
      <UserActivityContent />
    </ComponentErrorBoundary>
  );
}

// ===== Component 3: Ad Banner (minimal UI) =====
function AdBannerContent() {
  const { data, isLoading } = useQuery({
    queryKey: ['ads', 'banner'],
    queryFn: async () => {
      const response = await fetch('/api/ads/banner');
      if (!response.ok) throw new Error('광고를 불러올 수 없습니다');
      return response.json();
    },
    throwOnError: true,
    staleTime: 1000 * 60 * 30, // 30분
    retry: 0, // 광고는 재시도 안 함
  });

  if (isLoading) return null; // 광고는 로딩 UI 없이

  return (
    <View style={tw`p-4 bg-blue-50 rounded-lg`}>
      <Text style={tw`text-sm font-semibold text-blue-900 mb-1`}>
        {data.title}
      </Text>
      <Text style={tw`text-xs text-blue-700`}>{data.description}</Text>
    </View>
  );
}

export function AdBanner() {
  return (
    <ComponentErrorBoundary>
      <AdBannerContent />
    </ComponentErrorBoundary>
  );
}

/**
 * 사용 예시 - 복합 화면에서 사용:
 *
 * import { RecommendedPosts, UserActivity, AdBanner } from './examples/ComponentLevelExample';
 *
 * function HomeScreen() {
 *   return (
 *     <ScrollView>
 *       <MainContent />
 *
 *       <RecommendedPosts />
 *       <UserActivity />
 *       <AdBanner />
 *     </ScrollView>
 *   );
 * }
 */
