# Patches

이 디렉토리는 pnpm patch를 사용하여 생성된 패키지 패치 파일들을 포함합니다.

## 패치 목록

### @gorhom/bottom-sheet

**문제**: React Native 0.82 버전에서 `unstable_getBoundingClientRect`가 `undefined`일 때 `!== null` 체크가 실패하여 에러 발생

**해결**: `src/hooks/useBoundingClientRect.ts`에서 `!== null`을 `!= null`로 변경하여 `undefined`도 함께 체크하도록 수정

**적용 파일**:

- `src/hooks/useBoundingClientRect.ts` (59, 67번 줄)

**관련 이슈**: React Native 0.82와 @gorhom/bottom-sheet 호환성 문제

**추후 조치**: [@gorhom/bottom-sheet 이슈 티켓](https://github.com/gorhom/react-native-bottom-sheet/pull/2561) 이슈 해결 시 업데이트

## 패치 사용 방법

### 패치 자동 적용

프로젝트에 `pnpm install`을 실행하면 자동으로 패치가 적용됩니다.

```bash
pnpm install
```

### 새로운 패치 생성

1. 패치할 패키지의 편집 가능한 복사본 생성:

```bash
pnpm patch <package-name>
```

2. 표시된 경로에서 파일 수정:

```bash
# 예: node_modules/.pnpm_patches/@gorhom/bottom-sheet@5.2.6/
```

3. 변경 사항을 패치 파일로 저장:

```bash
pnpm patch-commit '<패치 폴더 경로>'
```

### 패치 제거

1. `package.json`에서 `pnpm.patchedDependencies`에서 해당 항목 제거
2. `patches/` 디렉토리에서 해당 패치 파일 삭제
3. `pnpm install` 실행

## 주의사항

- 이 폴더의 모든 파일은 Git에 커밋되어야 합니다
- 패치 파일을 수동으로 수정하지 마세요 (항상 `pnpm patch` 명령어 사용)
- 패키지 버전 업데이트 시 패치가 적용되지 않을 수 있으므로 재생성 필요
