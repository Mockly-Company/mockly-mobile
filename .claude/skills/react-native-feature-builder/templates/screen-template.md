# Screen 템플릿

React Native Screen 컴포넌트 작성 시 사용하는 템플릿입니다.

## 기본 Screen 구조

\`\`\`typescript
// src/presentation/screens/[FeatureName]Screen/[FeatureName]Screen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
View,
Text,
ScrollView,
TouchableOpacity,
ActivityIndicator,
SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

// Custom Hooks
import { use[Feature] } from '@/presentation/hooks/use[Feature]';

// Components
import { [Component] } from './components/[Component]';

// Styles
import { styles } from './[FeatureName]Screen.styles';

// Types
import type { [FeatureName]ScreenNavigationProp, [FeatureName]ScreenRouteProp } from '@/presentation/navigation/types';

export const [FeatureName]Screen: React.FC = () => {
// 1. Navigation & Route
const navigation = useNavigation<[FeatureName]ScreenNavigationProp>();
const route = useRoute<[FeatureName]ScreenRouteProp>();

// 2. Custom Hooks
const { data, isLoading, error, action } = use[Feature]();

// 3. Local State
const [localState, setLocalState] = useState<Type>(initialValue);

// 4. Effects
useEffect(() => {
// 초기 데이터 로드
}, []);

// 5. Event Handlers
const handleAction = useCallback(() => {
// 액션 처리
}, []);

// 6. Early Returns
if (isLoading) {
return (
<View style={styles.centerContainer}>
<ActivityIndicator size="large" />
</View>
);
}

if (error) {
return (
<View style={styles.centerContainer}>
<Text style={styles.errorText}>{error}</Text>
</View>
);
}

// 7. Main Render
return (
<SafeAreaView style={styles.container}>
<ScrollView>
{/_ Content _/}
</ScrollView>
</SafeAreaView>
);
};
\`\`\`

## 예제 1: LoginScreen

\`\`\`typescript
// src/presentation/screens/LoginScreen/LoginScreen.tsx

import React, { useState } from 'react';
import {
View,
Text,
TextInput,
TouchableOpacity,
ActivityIndicator,
Alert,
KeyboardAvoidingView,
Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '@/presentation/hooks/useAuth';
import { styles } from './LoginScreen.styles';

import type { AuthNavigationProp } from '@/presentation/navigation/types';

export const LoginScreen: React.FC = () => {
const navigation = useNavigation<AuthNavigationProp>();
const { login, isLoading, error } = useAuth();

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const handleLogin = async () => {
if (!email || !password) {
Alert.alert('Error', 'Please enter email and password');
return;
}

    try {
      await login(email, password);
      // 성공 시 자동으로 Home으로 이동 (useAuth에서 처리)
    } catch (err) {
      Alert.alert('Login Failed', err.message);
    }

};

const navigateToSignUp = () => {
navigation.navigate('SignUp');
};

return (
<KeyboardAvoidingView
behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
style={styles.container} >
<View style={styles.content}>
<Text style={styles.title}>Welcome Back</Text>
<Text style={styles.subtitle}>Sign in to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
          editable={!isLoading}
        />

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={navigateToSignUp}
          disabled={isLoading}
        >
          <Text style={styles.linkText}>
            Don't have an account? Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>

);
};
\`\`\`

## 예제 2: ProfileScreen (탭 기반)

\`\`\`typescript
// src/presentation/screens/ProfileScreen/ProfileScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
import {
View,
Text,
ScrollView,
Image,
TouchableOpacity,
RefreshControl,
ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useProfile } from '@/presentation/hooks/useProfile';
import { useAuth } from '@/presentation/hooks/useAuth';

import { ProfileHeader } from './components/ProfileHeader';
import { ProfileStats } from './components/ProfileStats';
import { PostList } from './components/PostList';

import { styles } from './ProfileScreen.styles';

import type { ProfileScreenNavigationProp, ProfileScreenRouteProp } from '@/presentation/navigation/types';

export const ProfileScreen: React.FC = () => {
const navigation = useNavigation<ProfileScreenNavigationProp>();
const route = useRoute<ProfileScreenRouteProp>();
const { currentUser } = useAuth();

const userId = route.params?.userId || currentUser?.id;

const {
profile,
posts,
isLoading,
isRefreshing,
error,
loadProfile,
loadPosts,
refresh,
} = useProfile(userId);

const [activeTab, setActiveTab] = useState<'posts' | 'likes'>('posts');

useEffect(() => {
loadProfile();
loadPosts();
}, [userId]);

const handleEditProfile = useCallback(() => {
navigation.navigate('EditProfile');
}, [navigation]);

const handleFollowToggle = useCallback(async () => {
// Follow/Unfollow 로직
}, []);

if (isLoading && !profile) {
return (
<View style={styles.centerContainer}>
<ActivityIndicator size="large" />
</View>
);
}

if (error && !profile) {
return (
<View style={styles.centerContainer}>
<Text style={styles.errorText}>{error}</Text>
<TouchableOpacity onPress={loadProfile}>
<Text style={styles.retryText}>Retry</Text>
</TouchableOpacity>
</View>
);
}

const isOwnProfile = profile?.id === currentUser?.id;

return (
<ScrollView
style={styles.container}
refreshControl={
<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
} >
<ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        onEditPress={handleEditProfile}
        onFollowPress={handleFollowToggle}
      />

      <ProfileStats
        postsCount={profile.postsCount}
        followersCount={profile.followersCount}
        followingCount={profile.followingCount}
      />

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'posts' && styles.tabActive]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={styles.tabText}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'likes' && styles.tabActive]}
          onPress={() => setActiveTab('likes')}
        >
          <Text style={styles.tabText}>Likes</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'posts' ? (
        <PostList posts={posts} onRefresh={loadPosts} />
      ) : (
        <PostList posts={profile.likedPosts} onRefresh={loadPosts} />
      )}
    </ScrollView>

);
};
\`\`\`

## 예제 3: PostListScreen (FlatList)

\`\`\`typescript
// src/presentation/screens/PostListScreen/PostListScreen.tsx

import React, { useEffect, useCallback } from 'react';
import {
View,
FlatList,
ActivityIndicator,
RefreshControl,
Text,
TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { usePosts } from '@/presentation/hooks/usePosts';
import { PostCard } from '@/presentation/components/PostCard';
import { EmptyState } from '@/presentation/components/EmptyState';

import { styles } from './PostListScreen.styles';

import type { Post } from '@/domain/entities/Post';
import type { HomeNavigationProp } from '@/presentation/navigation/types';

export const PostListScreen: React.FC = () => {
const navigation = useNavigation<HomeNavigationProp>();
const {
posts,
isLoading,
isRefreshing,
isLoadingMore,
hasMore,
error,
loadPosts,
refresh,
loadMore,
} = usePosts();

useEffect(() => {
loadPosts();
}, []);

const handlePostPress = useCallback((post: Post) => {
navigation.navigate('PostDetail', { postId: post.id });
}, [navigation]);

const handleCreatePost = useCallback(() => {
navigation.navigate('CreatePost');
}, [navigation]);

const renderItem = useCallback(({ item }: { item: Post }) => (
<PostCard post={item} onPress={() => handlePostPress(item)} />
), [handlePostPress]);

const renderFooter = useCallback(() => {
if (!isLoadingMore) return null;
return (
<View style={styles.footer}>
<ActivityIndicator />
</View>
);
}, [isLoadingMore]);

const renderEmpty = useCallback(() => {
if (isLoading) return null;
return (
<EmptyState
        title="No posts yet"
        description="Be the first to create a post!"
        actionText="Create Post"
        onAction={handleCreatePost}
      />
);
}, [isLoading, handleCreatePost]);

if (error && posts.length === 0) {
return (
<View style={styles.centerContainer}>
<Text style={styles.errorText}>{error}</Text>
<TouchableOpacity onPress={loadPosts} style={styles.retryButton}>
<Text style={styles.retryText}>Retry</Text>
</TouchableOpacity>
</View>
);
}

return (
<View style={styles.container}>
<FlatList
data={posts}
renderItem={renderItem}
keyExtractor={(item) => item.id}
onEndReached={hasMore ? loadMore : undefined}
onEndReachedThreshold={0.5}
ListFooterComponent={renderFooter}
ListEmptyComponent={renderEmpty}
refreshControl={
<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
}
contentContainerStyle={posts.length === 0 && styles.emptyContainer}
/>

      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreatePost}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>

);
};
\`\`\`

## Styles 파일 예제

\`\`\`typescript
// src/presentation/screens/LoginScreen/LoginScreen.styles.ts

import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/presentation/theme';

export const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: colors.background,
},
content: {
flex: 1,
justifyContent: 'center',
paddingHorizontal: spacing.lg,
},
title: {
...typography.h1,
marginBottom: spacing.sm,
textAlign: 'center',
},
subtitle: {
...typography.body,
color: colors.textSecondary,
marginBottom: spacing.xl,
textAlign: 'center',
},
input: {
height: 50,
borderWidth: 1,
borderColor: colors.border,
borderRadius: 8,
paddingHorizontal: spacing.md,
marginBottom: spacing.md,
backgroundColor: colors.white,
},
button: {
height: 50,
backgroundColor: colors.primary,
borderRadius: 8,
justifyContent: 'center',
alignItems: 'center',
marginTop: spacing.md,
},
buttonDisabled: {
opacity: 0.5,
},
buttonText: {
color: colors.white,
fontSize: 16,
fontWeight: '600',
},
errorText: {
color: colors.error,
marginBottom: spacing.md,
textAlign: 'center',
},
linkText: {
color: colors.primary,
marginTop: spacing.lg,
textAlign: 'center',
},
centerContainer: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
padding: spacing.lg,
},
});
\`\`\`

## Screen 작성 체크리스트

- [ ] Navigation 타입 정의
- [ ] Custom Hooks 사용
- [ ] Loading 상태 처리
- [ ] Error 상태 처리
- [ ] Empty 상태 처리 (목록 화면)
- [ ] Refresh 기능 (목록 화면)
- [ ] Keyboard 처리 (폼 화면)
- [ ] 접근성 속성
- [ ] 플랫폼별 처리 (필요시)
- [ ] SafeAreaView 사용
- [ ] Styles 분리
