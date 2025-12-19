import { capitalize } from '@utils/stringUtils';

describe('문자열 유틸 테스트', () => {
  it('capitalize 함수는 문자열의 첫 글자를 대문자로 변환해야 함', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('world')).toBe('World');
    expect(capitalize('테스트')).toBe('테스트');
  });
  it('빈 문자열을 입력하면 빈 문자열을 반환해야 함', () => {
    expect(capitalize('')).toBe('');
  });
});
