import { z } from 'zod';

/**
 * 한국 휴대폰 번호 유틸리티
 *
 * @example
 * // Zod 스키마로 검증
 * PhoneNumber.schema.parse('010-1234-5678') // ✅
 *
 * // 포맷팅
 * PhoneNumber.format('01012345678') // '010-1234-5678'
 *
 * // 하이픈 제거
 * PhoneNumber.removeHyphens('010-1234-5678') // '01012345678'
 */
export const PhoneNumber = {
  /**
   * 한국 휴대폰 번호 형식을 검증하는 Zod 스키마
   *
   * 지원 형식:
   * - 010-XXXX-XXXX
   *
   * @example
   * PhoneNumber.schema.parse('010-1234-5678') // ✅ 통과
   * PhoneNumber.schema.parse('01012345678')   // ❌ 실패 (하이픈 없음)
   * PhoneNumber.schema.parse('010-123-4567')  // ❌ 실패 (형식 불일치)
   * PhoneNumber.schema.parse('02-123-4567')   // ❌ 실패 (지역번호)
   */
  schema: z
    .string()
    .regex(/^(010)-\d{4}-\d{4}$/, '올바른 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)'),

  /**
   * 하이픈 없는 휴대폰 번호를 하이픈이 있는 형식으로 변환
   *
   * @param phone - 하이픈 없는 휴대폰 번호 (예: "01012345678")
   * @returns 하이픈이 포함된 휴대폰 번호 (예: "010-1234-5678")
   *
   * @example
   * PhoneNumber.format('01012345678') // '010-1234-5678'
   * PhoneNumber.format('1234') // '010-1234'
   * PhoneNumber.format('12345678') // '010-1234-5678'
   */
  format(phone: string): string {
    // 입력 검증
    if (!phone || typeof phone !== 'string') {
      return '010-';
    }

    const cleaned = phone.replace(/\D/g, '');

    // 빈 문자열 처리
    if (cleaned.length === 0) {
      return '010-';
    }

    // 010으로 시작하도록 보장
    const withPrefix = cleaned.startsWith('010') ? cleaned : `010${cleaned}`;

    // 최대 11자리까지만
    const limited = withPrefix.slice(0, 11);

    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 7) {
      return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    } else {
      return `${limited.slice(0, 3)}-${limited.slice(3, 7)}-${limited.slice(7)}`;
    }
  },

  /**
   * 휴대폰 번호에서 하이픈을 제거
   *
   * @param phone - 하이픈이 포함된 휴대폰 번호 (예: "010-1234-5678")
   * @returns 하이픈이 제거된 휴대폰 번호 (예: "01012345678")
   *
   * @example
   * PhoneNumber.removeHyphens('010-1234-5678') // '01012345678'
   */
  removeHyphens(phone: string): string {
    return phone.replace(/-/g, '');
  },
} as const;

/**
 * PhoneNumber 스키마의 타입
 *
 * @example
 * const phone: PhoneNumberType = '010-1234-5678';
 */
export type PhoneNumberType = z.infer<typeof PhoneNumber.schema>;
