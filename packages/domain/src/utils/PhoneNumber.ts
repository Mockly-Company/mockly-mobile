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
  schema: z
    .string()
    .regex(/^(010)-\d{4}-\d{4}$/, '올바른 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)'),

  format(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');

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

  removeHyphens(phone: string): string {
    return phone.replace(/-/g, '');
  },
} as const;

export type PhoneNumberType = z.infer<typeof PhoneNumber.schema>;
