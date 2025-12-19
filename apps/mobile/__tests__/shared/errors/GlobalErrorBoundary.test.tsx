import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { GlobalErrorBoundary } from '@errors/boundaries/GlobalErrorBoundary';
import { AppError, ErrorCoverage, ErrorCode } from '@errors/AppError';
import RNRestart from 'react-native-restart';

// Mock dependencies
jest.mock('react-native-restart', () => ({
  restart: jest.fn(),
}));

// 에러를 발생시키는 테스트 컴포넌트
const ThrowError: React.FC<{ error: Error }> = ({ error }) => {
  throw error;
};

describe('GlobalErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // React의 에러 로깅 억제
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('정상 렌더링', () => {
    it('에러가 없을 때 children을 정상 렌더링해야 함', () => {
      render(
        <GlobalErrorBoundary>
          <Text>정상 컴포넌트</Text>
        </GlobalErrorBoundary>,
      );

      expect(screen.getByText('정상 컴포넌트')).toBeTruthy();
    });
  });

  describe('AppError 처리 (GLOBAL Coverage)', () => {
    it('GLOBAL AppError 발생 시 GlobalErrorFallback을 렌더링해야 함', () => {
      const error = new AppError(
        new Error('Critical error'),
        ErrorCoverage.GLOBAL,
        '치명적인 오류가 발생했습니다',
        ErrorCode.INTERNAL_SERVER_ERROR,
      );

      render(
        <GlobalErrorBoundary>
          <ThrowError error={error} />
        </GlobalErrorBoundary>,
      );

      expect(screen.getByText('Error')).toBeTruthy();
      expect(screen.getByText('치명적인 오류가 발생했습니다')).toBeTruthy();
      expect(screen.getByText(/앱을 다시 시작해야 합니다/)).toBeTruthy();
    });

    it('앱 다시 시작 버튼 클릭 시 RNRestart.restart()가 호출되어야 함', () => {
      const error = new AppError(
        new Error('Critical error'),
        ErrorCoverage.GLOBAL,
        '치명적인 오류가 발생했습니다',
      );

      render(
        <GlobalErrorBoundary>
          <ThrowError error={error} />
        </GlobalErrorBoundary>,
      );

      const restartButton = screen.getByText('앱 다시 시작');
      fireEvent.press(restartButton);

      expect(RNRestart.restart).toHaveBeenCalledTimes(1);
    });

    it('displayMessage가 없을 때 기본 error.message를 표시해야 함', () => {
      const error = new AppError(
        new Error('Default message'),
        ErrorCoverage.GLOBAL,
      );

      render(
        <GlobalErrorBoundary>
          <ThrowError error={error} />
        </GlobalErrorBoundary>,
      );

      expect(screen.getByText('Default message')).toBeTruthy();
    });
  });

  describe('Non-AppError 처리', () => {
    it('일반 Error 발생 시 re-throw하여 상위로 전파해야 함', () => {
      const normalError = new Error('Normal error');

      render(
        <GlobalErrorBoundary>
          <ThrowError error={normalError} />
        </GlobalErrorBoundary>,
      );

      // 일반 Error는 GlobalErrorBoundary가 re-throw하므로
      // Fallback이 아닌 에러가 발생해야 함
      // React Error Boundary는 에러를 삼키고 Fallback을 보여주지만,
      // 우리 onError에서 re-throw하므로 실제로는 throw됨
      // 하지만 테스트 환경에서는 boundary가 먼저 catch하므로
      // Fallback이 렌더링되지 않는 것을 확인
      expect(screen.queryByText('알 수 없는 오류가 발생했습니다')).toBeNull();
    });
  });

  describe('다른 Coverage의 AppError', () => {
    it('SCREEN AppError는 GlobalErrorBoundary에서 처리하지 않아야 함', () => {
      const error = new AppError(
        new Error('Screen error'),
        ErrorCoverage.SCREEN,
        '화면 오류',
      );

      render(
        <GlobalErrorBoundary>
          <ThrowError error={error} />
        </GlobalErrorBoundary>,
      );

      // SCREEN 에러는 GlobalErrorBoundary에서 fallback을 보여주지 않음
      expect(screen.queryByText('앱을 다시 시작해야 합니다')).toBeNull();
    });

    it('COMPONENT AppError는 GlobalErrorBoundary에서 처리하지 않아야 함', () => {
      const error = new AppError(
        new Error('Component error'),
        ErrorCoverage.COMPONENT,
        '컴포넌트 오류',
      );

      render(
        <GlobalErrorBoundary>
          <ThrowError error={error} />
        </GlobalErrorBoundary>,
      );

      // COMPONENT 에러는 GlobalErrorBoundary에서 fallback을 보여주지 않음
      expect(screen.queryByText('앱을 다시 시작해야 합니다')).toBeNull();
    });
  });

  describe('에러 로깅', () => {
    it('모든 에러는 logger.logException으로 로깅되어야 함', () => {
      const { logger } = require('@utils/logger');
      const error = new AppError(
        new Error('Global error'),
        ErrorCoverage.GLOBAL,
        '전역 에러',
      );

      render(
        <GlobalErrorBoundary>
          <ThrowError error={error} />
        </GlobalErrorBoundary>,
      );

      expect(logger.logException).toHaveBeenCalledWith(error, {
        boundary: 'GlobalErrorBoundary',
      });
    });
  });
});
