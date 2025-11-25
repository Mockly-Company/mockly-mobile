/**
 * 복합 화면 예시 (Screen + Component ErrorBoundary 조합)
 *
 * Screen 레벨: 화면 필수 데이터 (메인 게시글 목록)
 * Component 레벨: 옵셔널 데이터 (추천, 광고, 활동)
 *
 * 이 패턴이 가장 실전에서 많이 사용됩니다.
 */

import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { tw } from '@mockly/design-system';
import {
  ScreenErrorBoundary,
  ComponentErrorBoundary,
} from '@shared/errors/boundaries';

// ===== Mock API Types =====
interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  likes: number;
}

interface RecommendedUser {
  id: string;
  name: string;
  avatar: string;
}

// ===== API Functions =====
async function fetchMainPosts(): Promise<Post[]> {
  const response = await fetch('/api/posts');
  if (!response.ok) throw new Error('게시글을 불러올 수 없습니다');
  return response.json();
}

async function fetchRecommendedUsers(): Promise<RecommendedUser[]> {
  const response = await fetch('/api/users/recommended');
  if (!response.ok) throw new Error('추천 사용자를 불러올 수 없습니다');
  return response.json();
}

// ===== Main Content (Screen Level - 필수) =====
function MainPostsContent() {
  const { data, isLoading } = useQuery<Post[]>({
    queryKey: ['posts', 'main'],
    queryFn: fetchMainPosts,
    // ✨ Screen 필수 데이터는 throwOnError
    throwOnError: true,
  });

  if (isLoading || !data) {
    return (
      <View style={tw`flex-1 items-center justify-center py-20`}>
        <ActivityIndicator size="large" />
        <Text style={tw`mt-4 text-gray-600`}>게시글 로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={tw`px-4`}>
      <Text style={tw`text-2xl font-bold text-gray-900 mb-4`}>최신 게시글</Text>
      {data.map(post => (
        <TouchableOpacity
          key={post.id}
          style={tw`p-4 mb-3 bg-white rounded-lg shadow-sm border border-gray-200`}
        >
          <Text style={tw`text-lg font-semibold text-gray-900 mb-2`}>
            {post.title}
          </Text>
          <Text style={tw`text-sm text-gray-600 mb-3`} numberOfLines={3}>
            {post.content}
          </Text>
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-xs text-gray-500`}>by {post.author}</Text>
            <Text style={tw`text-xs text-primary font-medium`}>
              ❤️ {post.likes}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ===== Optional Component 1: Recommended Users =====
function RecommendedUsersContent() {
  const { data, isLoading } = useQuery<RecommendedUser[]>({
    queryKey: ['users', 'recommended'],
    queryFn: fetchRecommendedUsers,
    throwOnError: true,
    staleTime: 1000 * 60 * 10,
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
      <Text style={tw`text-lg font-semibold text-gray-900 mb-3`}>
        추천 사용자
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map(user => (
          <TouchableOpacity key={user.id} style={tw`mr-3 items-center`}>
            <View
              style={tw`w-16 h-16 bg-primary rounded-full items-center justify-center mb-2`}
            >
              <Text style={tw`text-lg text-white font-bold`}>
                {user.name.charAt(0)}
              </Text>
            </View>
            <Text
              style={tw`text-xs text-gray-700 text-center`}
              numberOfLines={1}
            >
              {user.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function RecommendedUsers() {
  return (
    <ComponentErrorBoundary>
      <RecommendedUsersContent />
    </ComponentErrorBoundary>
  );
}

// ===== Optional Component 2: Trending Topics =====
function TrendingTopicsContent() {
  const { data, isLoading } = useQuery<string[]>({
    queryKey: ['topics', 'trending'],
    queryFn: async () => {
      const response = await fetch('/api/topics/trending');
      if (!response.ok) throw new Error('트렌딩 토픽을 불러올 수 없습니다');
      return response.json();
    },
    throwOnError: true,
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
      <Text style={tw`text-lg font-semibold text-gray-900 mb-3`}>
        🔥 트렌딩 토픽
      </Text>
      <View style={tw`flex-row flex-wrap`}>
        {data.map((topic: string, index: number) => (
          <View
            key={index}
            style={tw`px-3 py-2 mr-2 mb-2 bg-blue-100 rounded-full`}
          >
            <Text style={tw`text-sm text-blue-700 font-medium`}>#{topic}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function TrendingTopics() {
  return (
    <ComponentErrorBoundary>
      <TrendingTopicsContent />
    </ComponentErrorBoundary>
  );
}

// ===== Main Screen =====
function HomeScreenContent() {
  return (
    <ScrollView style={tw`flex-1 bg-gray-50`}>
      {/* 🎯 Screen 필수 데이터 - 에러 시 화면 전체 에러 */}
      <MainPostsContent />

      <View style={tw`h-px bg-gray-200 my-6`} />

      {/* 🎨 Component 옵셔널 데이터 - 에러 시 해당 부분만 에러 */}
      <View style={tw`px-4 mb-6`}>
        <RecommendedUsers />
      </View>

      <View style={tw`px-4 mb-6`}>
        <TrendingTopics />
      </View>

      {/* 추가 옵셔널 컴포넌트들... */}
    </ScrollView>
  );
}

export function ComplexHomeScreenExample() {
  return (
    <ScreenErrorBoundary screenName="홈">
      <HomeScreenContent />
    </ScreenErrorBoundary>
  );
}

/**
 * 이 패턴의 장점:
 *
 * 1. ✅ 필수 데이터 에러 → 화면 전체 에러 UI
 *    - 사용자: "게시글을 불러올 수 없습니다" + 재시도 버튼
 *
 * 2. ✅ 옵셔널 데이터 에러 → 해당 부분만 에러 UI
 *    - 추천 사용자 로드 실패해도 게시글은 보임
 *    - 트렌딩 토픽 실패해도 게시글, 추천 사용자는 보임
 *
 * 3. ✅ 각 컴포넌트 독립적 retry
 *    - 게시글 재시도 ≠ 추천 사용자 재시도
 *
 * 4. ✅ React Query 캐싱
 *    - 한 번 성공한 데이터는 캐싱됨
 *    - 다른 화면 갔다가 돌아와도 즉시 표시
 */
