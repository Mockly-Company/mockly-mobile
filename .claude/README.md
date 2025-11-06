# Claude Code 프로젝트 설정

이 디렉토리는 Claude Code의 프로젝트별 설정을 포함합니다.

## 📁 디렉토리 구조

```
.claude/
├── commands/      # 커스텀 slash commands
├── skills/        # 프로젝트 전용 skills
├── hooks/         # 프로젝트 hooks
└── README.md      # 이 파일
```

## 🚀 사용 방법

### Slash Commands
`.claude/commands/` 디렉토리에 `.md` 파일을 추가하면 자동으로 커스텀 slash command로 등록됩니다.

예시: `.claude/commands/review.md`
```markdown
---
description: 코드 리뷰를 수행합니다
---

현재 변경사항을 검토하고 다음을 확인해주세요:
- 코드 품질
- 잠재적 버그
- 성능 이슈
- 보안 취약점
```

사용: `/review` 명령어로 실행

### Skills
`.claude/skills/` 디렉토리에 프로젝트 전용 skill을 추가할 수 있습니다.

#### 단일 파일 스킬
간단한 스킬은 `.md` 파일로 작성:

예시: `.claude/skills/testing.md`
```markdown
---
name: testing
description: 이 프로젝트의 테스트 작성 가이드
---

# Testing Skill

이 프로젝트의 테스트 작성 규칙:
1. Jest를 사용한 단위 테스트
2. 모든 컴포넌트는 최소 80% 커버리지
3. E2E 테스트는 Playwright 사용
```

#### 폴더 구조 스킬
복잡한 스킬은 폴더로 구성:

```
.claude/skills/my-skill/
├── SKILL.md          # 메인 스킬 파일 (대문자)
├── FORMS.md          # 출력 형식 정의 (선택)
├── README.md         # 문서
└── templates/        # 추가 리소스
    ├── template1.md
    └── template2.md
```

예시: `.claude/skills/auto-test-generator/` (이 프로젝트에 포함됨)
- 코드 변경 감지 및 테스트 자동 생성
- 프론트엔드/백엔드 템플릿 제공
- FORMS.md로 출력 형식 표준화
- 상세 가이드는 해당 폴더의 README.md 참고

### Hooks
`.claude/hooks/` 디렉토리에 이벤트 기반 자동화를 설정할 수 있습니다.

## 📝 Git 공유

이 `.claude` 디렉토리는 Git에 커밋되어 팀원들과 공유됩니다.
팀원이 프로젝트를 클론하면 자동으로 모든 커스텀 설정을 사용할 수 있습니다.

## 🔧 추가 설정

더 많은 정보는 [Claude Code 문서](https://code.claude.com/docs)를 참고하세요.
