const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 새로운 기능
        'fix', // 버그 수정
        'docs', // 문서 변경
        'style', // 코드 포맷팅, 세미콜론 누락 등 (코드 변경 없음)
        'refactor', // 리팩토링
        'test', // 테스트 코드
        'chore', // 빌드 업무, 패키지 매니저 설정 등
        'perf', // 성능 개선
        'ci', // CI 설정 파일 수정
        'build', // 빌드 시스템 또는 외부 종속성에 영향을 미치는 변경사항
        'revert', // 커밋 되돌리기
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [0], // subject case 체크 비활성화 (한글, 고유명사 허용)
    'header-max-length': [2, 'always', 100],
  },
  parserPreset: {
    parserOpts: {
      headerPattern: /^\[(\w+)\] (.+)$/,
      headerCorrespondence: ['type', 'subject'],
    },
  },
};
export default config;
