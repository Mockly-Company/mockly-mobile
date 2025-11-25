import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { GlobalErrorBoundary } from '@shared/errors/boundaries/GlobalErrorBoundary';
import { AppError, ErrorCoverage, ErrorCode } from '@shared/errors/AppError';
import RNRestart from 'react-native-restart';

// Mock dependencies
jest.mock('react-native-restart', () => ({
  restart: jest.fn(),
}));

jest.mock('@shared/utils/logger', () => ({
  logger: {
    error: jest.fn(),
  },
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
    it('일반 Error 발생 시 children을 렌더링해야 함 (에러 처리 안 함)', () => {
      const normalError = new Error('Normal error');

      // 일반 Error는 GlobalErrorBoundary를 통과하므로 에러가 발생함
      expect(() => {
        render(
          <GlobalErrorBoundary>
            <ThrowError error={normalError} />
          </GlobalErrorBoundary>,
        );
      }).toThrow('Normal error');
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
    it('LOGGING Coverage AppError는 로깅만 하고 fallback을 표시하지 않아야 함', () => {
      const { logger } = require('@shared/utils/logger');
      const error = new AppError(
        new Error('Logging error'),
        ErrorCoverage.LOGGING,
        '로깅 전용 에러',
      );

      render(
        <GlobalErrorBoundary>
          <ThrowError error={error} />
        </GlobalErrorBoundary>,
      );

      expect(logger.error).toHaveBeenCalled();
      expect(screen.queryByText('앱을 다시 시작해야 합니다')).toBeNull();
    });
  });
});
