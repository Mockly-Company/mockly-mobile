import { PlanType } from '../product';
import { PLAN_FEATURES } from '../product/product.constants';

export class SubscriptionService {
  // 토큰 사용량 퍼센트 계산
  static getTokenUsagePercent(usedTokens: number, planType: PlanType): number {
    const limit = PLAN_FEATURES[planType].monthlyTokenLimit;
    return Math.min((usedTokens / limit) * 100, 100);
  }

  // 일일 면접 제한 확인
  static canUseInterview(todayCount: number, planType: PlanType): boolean {
    const limit = PLAN_FEATURES[planType].dailyInterviewLimit;
    if (limit === null) return true; // 무제한
    return todayCount < limit;
  }
}
