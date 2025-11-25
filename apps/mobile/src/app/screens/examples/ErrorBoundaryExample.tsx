/**
 * 에러 바운더리 + Suspense 사용 예시
 * DataFetchWrapper 없이 명시적으로 에러 처리
 */
import React, { Suspense, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { tw } from '@mockly/design-system';
import {
  ComponentErrorBoundary,
  AppError,
  ErrorCoverage,
} from '@shared/errors';
import { withScreenErrorBoundary } from '../withScreenErrorBoundary';

// 예시 1: Suspense 명시적 에러 처리
function ExampleScreenComponent(): React.ReactElement {
  return (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-lg font-bold mb-4`}>
        Suspense + 명시적 에러 처리 예시
      </Text>

      {/* Suspense로 로딩 처리 */}
      <Suspense fallback={<LoadingSpinner />}>
        <DataComponent />
      </Suspense>

      {/* 옵셔널 컴포넌트 - 실패해도 앱은 계속 동작 */}
      <ComponentErrorBoundary>
        <Suspense fallback={<SmallSpinner />}>
          <OptionalWidget />
        </Suspense>
      </ComponentErrorBoundary>
    </View>
  );
}

ExampleScreenComponent.displayName = '예시 화면';
export const ExampleScreen = withScreenErrorBoundary(ExampleScreenComponent);

function DataComponent(): React.ReactElement {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        // 실제 API 호출
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 50% 확률로 에러 발생 (데모용)
        if (Math.random() > 0.5) {
          throw new Error('서버 응답 실패');
        }

        if (!cancelled) {
          setData('데이터 로드 성공!');
        }
      } catch (err) {
        if (!cancelled) {
          throw new AppError(err, ErrorCoverage.SCREEN);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) {
    // Suspense가 자동으로 fallback 보여줌
    throw new Promise(() => {});
  }

  return (
    <View style={tw`p-4 bg-blue-100 rounded-lg mb-4`}>
      <Text style={tw`text-base`}>{data}</Text>
    </View>
  );
}

// 예시 3: 옵셔널 위젯 - 실패해도 ComponentErrorBoundary가 처리
function OptionalWidget(): React.ReactElement {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new AppError(
      '위젯 로드 실패',
      ErrorCoverage.COMPONENT,
      'OptionalWidget',
    );
  }

  return (
    <View style={tw`p-4 bg-gray-100 rounded-lg`}>
      <Text style={tw`text-sm mb-2`}>옵셔널 위젯</Text>
      <TouchableOpacity
        style={tw`bg-red-500 px-3 py-1.5 rounded`}
        onPress={() => setShouldError(true)}
      >
        <Text style={tw`text-white text-xs`}>에러 발생시키기</Text>
      </TouchableOpacity>
    </View>
  );
}

// 예시 4: 화면 전체 에러
function BrokenScreenComponent(): React.ReactElement {
  throw new AppError(
    '화면 데이터를 불러올 수 없습니다',
    ErrorCoverage.SCREEN,
    '서버 응답 없음',
  );
}

BrokenScreenComponent.displayName = '고장난 화면';
export const BrokenScreen = withScreenErrorBoundary(BrokenScreenComponent);

// 로딩 컴포넌트들
function LoadingSpinner() {
  return (
    <View style={tw`p-4 items-center`}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={tw`mt-2 text-sm text-gray-600`}>로딩 중...</Text>
    </View>
  );
}

function SmallSpinner() {
  return (
    <View style={tw`p-2`}>
      <ActivityIndicator size="small" color="#666" />
    </View>
  );
}
