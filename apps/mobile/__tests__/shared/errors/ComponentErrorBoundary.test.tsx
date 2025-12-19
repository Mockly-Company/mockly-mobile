import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ComponentErrorBoundary } from '@errors/boundaries/ComponentErrorBoundary';
import { AppError, ErrorCoverage, ErrorCode } from '@errors/AppError';

const ThrowError: React.FC<{ error: Error }> = ({ error }) => {
  throw error;
};

describe('ComponentErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('에러가 없을 때 children을 정상 렌더링해야 함', () => {
    render(
      <ComponentErrorBoundary>
        <Text>정상 컴포넌트</Text>
      </ComponentErrorBoundary>,
    );

    expect(screen.getByText('정상 컴포넌트')).toBeTruthy();
  });

  it('COMPONENT AppError 발생 시 Fallback을 렌더링해야 함', () => {
    const error = new AppError(
      new Error('Component error'),
      ErrorCoverage.COMPONENT,
      '데이터를 불러올 수 없습니다',
      ErrorCode.NETWORK_ERROR,
    );

    render(
      <ComponentErrorBoundary>
        <ThrowError error={error} />
      </ComponentErrorBoundary>,
    );

    expect(
      screen.getAllByText('데이터를 불러올 수 없습니다').length,
    ).toBeGreaterThan(0);
    expect(screen.getByText('다시 시도')).toBeTruthy();
  });

  it('다시시도 버튼 클릭 시 자식 컴포넌트가 다시 렌더링되어야 함', () => {
    let shouldThrow = true;

    const RetryableComponent: React.FC = () => {
      if (shouldThrow) {
        throw new AppError(
          new Error('Component error'),
          ErrorCoverage.COMPONENT,
          '데이터를 불러올 수 없습니다',
          ErrorCode.NETWORK_ERROR,
        );
      }
      return <Text>재시도 후 정상 컴포넌트</Text>;
    };

    render(
      <ComponentErrorBoundary>
        <RetryableComponent />
      </ComponentErrorBoundary>,
    );

    expect(
      screen.getAllByText('데이터를 불러올 수 없습니다').length,
    ).toBeGreaterThan(0);

    // 다시 시도 전에 에러 상태 해제
    shouldThrow = false;

    const retryButton = screen.getByText('다시 시도');
    fireEvent.press(retryButton);

    expect(screen.getByText('재시도 후 정상 컴포넌트')).toBeTruthy();
  });

  it('displayMessage가 없을 때 기본 error.message를 표시해야 함', () => {
    const error = new AppError(
      new Error('Default message'),
      ErrorCoverage.COMPONENT,
    );

    render(
      <ComponentErrorBoundary>
        <ThrowError error={error} />
      </ComponentErrorBoundary>,
    );

    expect(screen.getByText('Default message')).toBeTruthy();
  });

  it('네트워크 에러 메시지를 표시해야 함', () => {
    const error = new AppError(
      new Error('Network failed'),
      ErrorCoverage.COMPONENT,
      '네트워크 연결을 확인해주세요',
      ErrorCode.NETWORK_ERROR,
    );

    render(
      <ComponentErrorBoundary>
        <ThrowError error={error} />
      </ComponentErrorBoundary>,
    );

    expect(screen.getByText('네트워크 연결을 확인해주세요')).toBeTruthy();
  });
});
