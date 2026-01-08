import { PlanType } from './product.type';

// 플랜별 기능 및 제한사항
export interface PlanFeatures {
  planType: PlanType;
  name: string;
  price: number;
  monthlyTokenLimit: number; // 월 토큰 한도
  dailyInterviewLimit: number | null; // 일 면접 횟수 (null = 무제한)
  features: {
    unlimitedInterviews: boolean; // 무제한 AI 면접 연습
    basicFeedback: boolean; // 기본 피드백
    detailedAnalysis: boolean; // 상세 분석 리포트
    priorityMatching: boolean; // 온라인 모의면접 우선 매칭
    unlimitedVideoStorage: boolean; // 녹화 영상 무제한 저장
    expertProfileAccess: boolean; // 전문가 프로필 열람
    aiCustomTraining: boolean; // AI 맞춤 훈련 세션
    resumeReview: boolean; // 이력서/자기소개서 첨삭
    publicMockInterview: number | null; // 공개 모의면접 참여 (null = 무제한)
  };
  displayFeatures: string[]; // UI 표시용 기능 목록
}

export const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
  [PlanType.enum.Free]: {
    planType: PlanType.enum.Free,
    name: '무료',
    price: 0,
    monthlyTokenLimit: 30000,
    dailyInterviewLimit: 3,
    features: {
      unlimitedInterviews: false,
      basicFeedback: true,
      detailedAnalysis: false,
      priorityMatching: false,
      unlimitedVideoStorage: false,
      expertProfileAccess: false,
      aiCustomTraining: false,
      resumeReview: false,
      publicMockInterview: 2,
    },
    displayFeatures: [
      '월 3만 토큰',
      '일 3회 AI 면접 연습',
      '기본 피드백 제공',
      '공개 모의면접 참여 (월 2회)',
    ],
  },
  [PlanType.enum.Basic]: {
    planType: PlanType.enum.Basic,
    name: 'Basic',
    price: 4900,
    monthlyTokenLimit: 200000,
    dailyInterviewLimit: null,
    features: {
      unlimitedInterviews: true,
      basicFeedback: true,
      detailedAnalysis: true,
      priorityMatching: false,
      unlimitedVideoStorage: false,
      expertProfileAccess: false,
      aiCustomTraining: false,
      resumeReview: false,
      publicMockInterview: null,
    },
    displayFeatures: [
      '월 20만 토큰',
      '무제한 AI 면접 연습',
      '상세 분석 리포트',
      '온라인 모의면접 참여',
    ],
  },
  [PlanType.enum.Pro]: {
    planType: PlanType.enum.Pro,
    name: 'Pro',
    price: 9900,
    monthlyTokenLimit: 400000,
    dailyInterviewLimit: null,
    features: {
      unlimitedInterviews: true,
      basicFeedback: true,
      detailedAnalysis: true,
      priorityMatching: true,
      unlimitedVideoStorage: true,
      expertProfileAccess: true,
      aiCustomTraining: false,
      resumeReview: false,
      publicMockInterview: null,
    },
    displayFeatures: [
      '월 40만 토큰',
      '무제한 AI 면접 연습',
      '상세 분석 리포트',
      '온라인 모의면접 우선 매칭',
      '녹화 영상 무제한 저장',
      '전문가 프로필 열람',
    ],
  },
  [PlanType.enum.Premium]: {
    planType: PlanType.enum.Premium,
    name: 'Premium',
    price: 14900,
    monthlyTokenLimit: 700000,
    dailyInterviewLimit: null,
    features: {
      unlimitedInterviews: true,
      basicFeedback: true,
      detailedAnalysis: true,
      priorityMatching: true,
      unlimitedVideoStorage: true,
      expertProfileAccess: true,
      aiCustomTraining: true,
      resumeReview: true,
      publicMockInterview: null,
    },
    displayFeatures: [
      '월 70만 토큰',
      '무제한 AI 면접 연습',
      '상세 분석 리포트',
      '온라인 모의면접 우선 매칭',
      '녹화 영상 무제한 저장',
      '전문가 프로필 열람',
      'AI 맞춤 훈련 세션',
      '이력서/자기소개서 첨삭',
    ],
  },
};

// 플랜 순서 (업그레이드 순서)
export const PLAN_HIERARCHY = [
  PlanType.enum.Free,
  PlanType.enum.Basic,
  PlanType.enum.Pro,
  PlanType.enum.Premium,
] as const;

// 플랜 색상 (UI용)
export const PLAN_COLORS: Record<PlanType, string> = {
  [PlanType.enum.Free]: 'gray',
  [PlanType.enum.Basic]: 'blue',
  [PlanType.enum.Pro]: 'purple',
  [PlanType.enum.Premium]: 'yellow',
};

// 플랜 아이콘 (UI용)
export const PLAN_ICONS: Record<PlanType, string> = {
  [PlanType.enum.Free]: '🆓',
  [PlanType.enum.Basic]: '⭐',
  [PlanType.enum.Pro]: '✨',
  [PlanType.enum.Premium]: '👑',
};
