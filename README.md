# Mockly Mobile

모던 React Native 모노레포
Turborepo + pnpm 기반, 디자인 시스템과 Storybook을 통합한 실전 모바일 앱 프로젝트

---

## 📦 패키지/앱별 역할 요약

- **mobile**: React Native 앱 구현 (iOS/Android), 상태관리(Zustand), 실제 앱 화면/기능 코드
- **storybook**: 모바일/웹에서 디자인 시스템 및 화면을 실시간으로 확인/문서화
- **design-system**: UI 컴포넌트/테마 패키지, 재사용성 강화, 시스템화된 테마/variant, tw 객체 제공
- **api**: 백엔드 API 연동, DTO→Entity 변환, 인증/인터셉터 등 서비스 코드
- **entities**: 실제 사용되는 도메인 엔티티 타입/인터페이스 정의
- **utils**: time/string format 등 공통 유틸리티 함수 모음
- **typescript-config**: tsconfig 설정 재사용 패키지 (모든 앱/패키지에서 참조)

---

<table>
  <tr>
      <td>라이트</td>
    <td>다크</td>
        <td>모바일 스토리북</td>
        <td>웹 스토리북</td>
  </tr>
  <tr>
    <td><image src="https://github.com/user-attachments/assets/5f3a634e-6d5f-4544-8bc6-b225bf8e3f30" style="width:300;"></image></td>
    <td><image src="https://github.com/user-attachments/assets/e9408cb8-872a-45e4-ba31-6883f859233a" style="width:300;"></image></td>
        <td><image src="https://github.com/user-attachments/assets/c11f1b8b-686e-435d-b64f-4a7a3818ee20" style="width:300;"></image></td>
        <td><image src="https://github.com/user-attachments/assets/0f9f4d8a-56dc-4727-b6d5-c7bf5bd3c12e" style="width:300;">
          <a href="https://69324aeddcbd1324310464e9-giibikyaod.chromatic.com/">디자인 시스템 보러가기</a>
        </image></td>
  </tr>
</table>

---

## 주요 특징

- Monorepo: Turborepo + pnpm workspace
- Design System: 재사용 가능한 UI 컴포넌트 패키지
- Storybook: 디자인 시스템 문서화 및 실시간 프리뷰
- 상태관리: Zustand
- 스타일링: Tailwind(twrnc) + cva + clsx + tailwind-merge
- API/엔티티/유틸: 패키지 분리, 타입 안전성 강화

## 폴더 구조

```
apps/
  mobile/      # 메인 React Native 앱
  storybook/   # 디자인 시스템/스토리북
packages/
  design-system/  # UI 컴포넌트/테마
  api/            # API 클라이언트
  entities/       # 타입/도메인 모델
  utils/          # 유틸리티
  typescript-config/
```

## 빠른 시작

### 개발 환경 사전 준비

- 앱 테스트 시 [React Native 공식 환경설정 가이드](https://reactnative.dev/docs/set-up-your-environment) 참고 (Node, Android Studio, Xcode 등 필수)
- storybook 웹 버전은 사전 설정이 없습니다.

### .env.dev 파일 필요

- 에뮬레이터로 앱 개발시 `apps/mobile/.env.dev` 파일을 반드시 생성해야 합니다.

```env
GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
GOOGLE_IOS_CLIENT_ID=your_google_ios_client_id
GOOGLE_ANDROID_CLIENT_ID=your_google_android_client_id
API_BASE_URL=http://localhost:8080
```

### 의존성 설치

```bash
pnpm install
```

### 앱 실행

```bash
pnpm dev
cd apps/mobile && pnpm android # 또는 pnpm ios
```

### 디자인 시스템/스토리북

```bash
pnpm storybook:generate // 최초 1회
pnpm storybook:web
pnpm storybook:android
```

## 테스트 실행

```bash
pnpm test
pnpm test:mobile
pnpm test:watch
pnpm test:coverage
```

---

## AGENTS (AI 어시스턴트)

- 기본적으로 Claude를 사용합니다.
- 컨텍스트/스킬 정의 파일 위치:
  - 관리 레포 : [AI 템플릿 레포](https://github.com/Mockly-Company/AI_TEMPLATE)
  - 컨텍스트 : [AGENTS.md](./AGENTS.md) (루트)
  - 스킬 : [Skill 폴더](./.claude/skills)
    └─ 종류:
    - [backend-test-generator](./.claude/skills/backend-test-generator/SKILL.md)
    - [code-review](./.claude/skills/code-review/SKILL.md)
    - [commit-message-formatter](./.claude/skills/commit-message-formatter/SKILL.md)
    - [frontend-test-generator](./.claude/skills/frontend-test-generator/SKILL.md)
    - [github-issue-generator](./.claude/skills/github-issue-generator/SKILL.md)
    - [github-task-ticket-generator](./.claude/skills/github-task-ticket-generator/SKILL.md)
    - [pr-message-generator](./.claude/skills/pr-message-generator/SKILL.md)
    - [prompt-enhancer](./.claude/skills/prompt-enhancer/SKILL.md)
    - [skill-creator](./.claude/skills/skill-creator/SKILL.md)
  - 커맨드 : [명령어 폴더](./.claude/commands/)
    └─ 종류:
    - [code-review](./.claude/commands/code-review.md)
    - [review-backend](./.claude/commands/review-backend.md)
    - [review-frontend](./.claude/commands/review-frontend.md)

실제 협업/자동화/AI 활용 시 위 파일을 참고하세요.

## 커밋 메시지 규칙

커밋 메시지 규칙은 [commitlint.config.js](./commitlint.config.js) 파일로 설정합니다.

- `[type] subject` (예: `[feat] Google 로그인 기능 추가`)
- type: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
