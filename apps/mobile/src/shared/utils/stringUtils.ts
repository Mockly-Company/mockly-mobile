/**
 * 문자열의 첫 글자를 대문자로 변환합니다.
 * @param str - 변환할 문자열
 * @returns 첫 글자가 대문자로 변환된 문자열
 * @example
 * capitalize('google') // 'Google'
 * capitalize('apple') // 'Apple'
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
