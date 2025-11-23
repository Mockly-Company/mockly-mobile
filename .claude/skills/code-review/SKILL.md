---
name: code-review
description: 코드 리뷰에 대한 요청이 있을 시, 코드를 확인하여 프론트엔드/백엔드인지 구분하고 프론트엔드/백엔드 관점에 맞는 리뷰 가이드를 참조합니다.
allowed-tools: Read, Grep, Glob, Bash
---

# Code Review

프론트엔드 또는 백엔드 코드를 분석하여 전문적인 코드 리뷰를 제공합니다.

## 작업 절차

### 1단계: 변경사항 확인

Git에서 변경된 파일 목록을 확인합니다:

```bash
# Staged와 unstaged 변경사항 모두 확인
git diff HEAD
git status --short
```

### 2단계: 파일 타입 자동 분류

변경된 파일들을 분석하여 다음과 같이 분류:

#### 프론트엔드 파일 감지

- React/React Native 컴포넌트: `*.tsx`, `*.jsx`
- 스타일: `*.css`, `*.scss`, `*.styled.ts`
- 프론트엔드 디렉토리: `src/components/`, `src/screens/`, `src/hooks/`, `src/pages/`
- 설정 파일: `vite.config.ts`, `webpack.config.js`, `tsconfig.json` (선택적)

#### 백엔드 파일 감지

- Spring Boot: `*Controller.java`, `*Service.java`, `*Repository.java`, `*Entity.java`
- Node.js/Express: `*route.ts`, `*controller.ts`, `*service.ts`, `*model.ts`
- 백엔드 디렉토리: `src/api/`, `src/services/`, `src/models/`, `src/routes/`, `src/main/java/`
- 설정 파일: `application.yml`, `application.properties`, `pom.xml`, `build.gradle`

### 3단계: 프론트엔드/백엔드 관점 적용

파일 타입 분류 결과에 따라 적절한 리뷰 관점을 적용:

#### 프론트엔드 코드인 경우

`references/frontend-review-guide.md` 리뷰 가이드를 참조하여 다음 항목들을 중점적으로 검토:

- React/프론트엔드 특화 사항 (컴포넌트, 상태 관리)
- XSS 취약점 및 보안 검증
- 성능 최적화 (번들 사이즈, lazy loading)
- 접근성 (a11y)
- TypeScript 타입 안전성

#### 백엔드 코드인 경우

`references/backend-review-guide.md` 리뷰 가이드를 참조하여 다음 항목들을 중점적으로 검토:

- SQL Injection 방지
- 인증/인가 로직
- 서버 사이드 validation
- 데이터베이스 쿼리 최적화
- API 설계 및 RESTful 규칙
- 에러 핸들링 및 로깅

#### 풀스택 변경사항인 경우

두 관점을 모두 적용:

- 프론트엔드와 백엔드 항목 모두 검토
- API 연동 부분 특히 주의 깊게 확인
- 클라이언트-서버 간 데이터 흐름 검증

### 4단계: 공통 검토 항목

파일 타입과 상관없이 모든 코드에서 다음 항목들을 검토:

- **코드 품질**: 가독성, 네이밍 컨벤션, DRY 원칙
- **보안**: 민감 정보 노출 방지, 환경 변수 사용
- **테스트**: 테스트 커버리지 및 테스트 코드 품질
- **타입 안전성**: TypeScript 타입 정의
- **성능**: 불필요한 연산 최소화

### 5단계: 리뷰 결과 제공

각 파일 항목별로 구체적인 피드백을 제공:

1. **파일별 요약**: 파일마다 주요 변경사항 요약
2. **심각도**: 이슈 우선순위 (🔴 Critical, 🟡 Warning, 💡 Info)
3. **코드 예시**: 코드 개선 예시와 함께 구체적인 제안
4. **좋은 사례**: 잘된 부분도 함께 언급

### 리뷰 보고서 형식

````markdown
# 코드 리뷰 결과

## 📊 변경사항 요약

- 총 변경 파일: X개
- 프론트엔드: Y개
- 백엔드: Z개

## 🔍 상세 리뷰

### [파일명] - [프론트엔드/백엔드]

#### 🔴 Critical Issues

- [이슈 설명]
  - **위치**: [구체적 설명]
  - **위험**: [파일명:라인]
  - **개선제안**:
    ```[language]
    [개선된 코드 예시]
    ```

#### 🟡 Warnings

- [이슈 설명]

#### 💡 Suggestions

- [개선 제안]

#### ✅ Good Practices

- [잘한 부분]

## 📝 종합 평가

[전반적인 코드 품질 평가 및 다음 개선 방향]
````

## 사용 예시

```
# 스킬 호출 방법
code-review

# 자연어 요청
"코드 리뷰해줘"
"변경사항 검토해줘"
"내 코드 확인해줘"
```

## 주의사항

1. **파일 타입 우선순위**: 파일명과 디렉토리 경로로 우선 판단, 파일 내용으로 재확인
2. **참조 가이드**: 각 카테고리 리뷰 시, 데이터베이스 및 참조 가이드가 존재하는지 확인하여 활용
3. **균형잡힌 피드백**: 문제점만 지적하는 것이 아니라 잘된 부분도 함께 언급
4. **실용적 리뷰**: 개선사항 제안 시 구체적인 코드 예시 제공
