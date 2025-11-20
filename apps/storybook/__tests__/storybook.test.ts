/**
 * Storybook 기본 테스트
 */

describe('Storybook', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true);
  });

  it('should verify jest is working', () => {
    const sum = (a: number, b: number) => a + b;
    expect(sum(1, 2)).toBe(3);
  });
});
