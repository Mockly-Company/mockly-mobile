/**
 * ScreenErrorBoundary 테스트
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ScreenErrorBoundary } from '@errors/boundaries/ScreenErrorBoundary';
import { AppError, ErrorCoverage, ErrorCode } from '@errors/AppError';

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

  describe('정상 렌더링', () => {
    it('에러가 없을 때 children을 정상 렌더링해야 함', () => {
      render(
        <ScreenErrorBoundary screenName="TestScreen">
          <Text>정상 컴포넌트</Text>
        </ScreenErrorBoundary>,
      );

      expect(screen.getByText('정상 컴포넌트')).toBeTruthy();
    });
  });

  describe('SCREEN AppError 처리', () => {
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

    it('다시 시도 버튼이 렌더링되어야 함', () => {
      const error = new AppError(
        new Error('Error'),
        ErrorCoverage.SCREEN,
        '에러',
      );

      render(
        <ScreenErrorBoundary screenName="TestScreen">
          <ThrowError error={error} />
        </ScreenErrorBoundary>,
      );

      expect(screen.getByText('다시 시도')).toBeTruthy();
    });

    it('다시 시도 버튼 클릭 시 자식 컴포넌트가 다시 렌더링되어야 함', () => {
      let shouldThrow = true;

      const RetryableComponent: React.FC = () => {
        if (shouldThrow) {
          throw new AppError(
            new Error('Screen error'),
            ErrorCoverage.SCREEN,
            '화면 오류',
          );
        }
        return <Text>재시도 후 정상 화면</Text>;
      };

      render(
        <ScreenErrorBoundary screenName="TestScreen">
          <RetryableComponent />
        </ScreenErrorBoundary>,
      );

      expect(screen.getByText('화면을 불러올 수 없습니다')).toBeTruthy();

      shouldThrow = false;
      const retryButton = screen.getByText('다시 시도');
      fireEvent.press(retryButton);

      expect(screen.getByText('재시도 후 정상 화면')).toBeTruthy();
    });
  });

  describe('에러 로깅', () => {
    it('SCREEN 에러는 logger.logException으로 로깅되어야 함', () => {
      const { logger } = require('@utils/logger');
      const error = new AppError(
        new Error('Screen error'),
        ErrorCoverage.SCREEN,
        '화면 에러',
      );

      render(
        <ScreenErrorBoundary screenName="TestScreen">
          <ThrowError error={error} />
        </ScreenErrorBoundary>,
      );

      expect(logger.logException).toHaveBeenCalledWith(error, {
        boundary: 'ScreenErrorBoundary',
        screenName: 'TestScreen',
      });
    });

    it('알 수 없는 에러는 logger.logException으로 로깅되어야 함', () => {
      const { logger } = require('@utils/logger');
      const error = new Error('Unknown error');

      render(
        <ScreenErrorBoundary screenName="TestScreen">
          <ThrowError error={error} />
        </ScreenErrorBoundary>,
      );

      expect(logger.logException).toHaveBeenCalledWith(error, {
        boundary: 'ScreenErrorBoundary',
        screenName: 'TestScreen',
        type: 'unknown',
      });
    });
  });
});
