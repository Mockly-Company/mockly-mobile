/**
 * ScreenErrorBoundary 테스트
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ScreenErrorBoundary } from '@shared/errors/boundaries/ScreenErrorBoundary';
import { AppError, ErrorCoverage, ErrorCode } from '@shared/errors/AppError';

jest.mock('@shared/utils/logger', () => ({
  logger: { error: jest.fn() },
}));

const ThrowError: React.FC<{ error: Error }> = ({ error }) => {
  throw error;
};

describe('ScreenErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('에러가 없을 때 children을 정상 렌더링해야 함', () => {
    render(
      <ScreenErrorBoundary screenName="TestScreen">
        <Text>정상 컴포넌트</Text>
      </ScreenErrorBoundary>,
    );

    expect(screen.getByText('정상 컴포넌트')).toBeTruthy();
  });

  it('SCREEN AppError 발생 시 Fallback을 렌더링해야 함', () => {
    const error = new AppError(
      new Error('Screen error'),
      ErrorCoverage.SCREEN,
      '화면을 불러올 수 없습니다',
      ErrorCode.NOT_FOUND,
    );

    render(
      <ScreenErrorBoundary screenName="HomeScreen">
        <ThrowError error={error} />
      </ScreenErrorBoundary>,
    );

    expect(screen.getByText('화면을 불러올 수 없습니다')).toBeTruthy();
    expect(
      screen.getByText(/HomeScreen 화면 로드 중 문제가 발생했습니다/),
    ).toBeTruthy();
  });

  it('screenName이 Fallback UI에 표시되어야 함', () => {
    const error = new AppError(
      new Error('Error'),
      ErrorCoverage.SCREEN,
      '에러 메시지',
    );

    render(
      <ScreenErrorBoundary screenName="ProfileScreen">
        <ThrowError error={error} />
      </ScreenErrorBoundary>,
    );

    expect(
      screen.getByText(/ProfileScreen 화면 로드 중 문제가 발생했습니다/),
    ).toBeTruthy();
  });
});
