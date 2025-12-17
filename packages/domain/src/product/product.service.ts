import { PLAN_FEATURES, PLAN_HIERARCHY } from '../product/product.constants';
import { MockProducts, PaidPlanType, PlanType, SubscriptionProduct } from './product.type';

export class ProductService {
  // 플랜 기능 조회
  static getPlanFeatures(planType: PlanType) {
    return PLAN_FEATURES[planType];
  }

  // 다음 상위 플랜 조회
  static getNextPlan(currentPlan: PlanType): SubscriptionProduct | null {
    const currentIndex = PLAN_HIERARCHY.indexOf(currentPlan);
    const isPremium = currentIndex === PLAN_HIERARCHY.length - 1;
    if (currentIndex < 0 || isPremium) {
      return null;
    }
    const nextPlanType = PLAN_HIERARCHY[currentIndex + 1];

    if (!this.isPaidPlan(nextPlanType)) {
      return null;
    }

    return MockProducts[nextPlanType];
  }

  // 유료 플랜인지 확인하는 타입 가드
  static isPaidPlan(planType: PlanType): planType is PaidPlanType {
    return planType !== 'FREE';
  }

  // 플랜 이름 조회
  static getPlanName(planType: PlanType): string {
    return PLAN_FEATURES[planType].name;
  }
}
