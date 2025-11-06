# MCP Builder Skill

MCP(Model Context Protocol) 서버를 생성하고 개발하기 위한 종합 가이드입니다.

## 개요

이 스킬은 Claude Code에서 MCP 서버를 쉽게 만들 수 있도록 도와줍니다. Python FastMCP와 Node.js MCP SDK 두 가지 방식을 지원합니다.

## 사용 시나리오

다음과 같은 경우 이 스킬을 사용하세요:

- 외부 API를 Claude와 통합하고 싶을 때
- 데이터베이스 쿼리 도구를 만들고 싶을 때
- 파일 시스템 작업을 자동화하고 싶을 때
- 커스텀 계산 도구가 필요할 때
- 특정 서비스와의 통합이 필요할 때

## 포함 내용

### 메인 스킬 (SKILL.md)
- MCP 개요 및 개념
- Python FastMCP 가이드
- Node.js MCP SDK 가이드
- 설계 원칙 및 베스트 프랙티스
- 프로젝트 설정 방법
- 테스트 전략

### 템플릿

#### templates/python-fastmcp.md
완전한 Python FastMCP 서버 템플릿:
- 기본 프로젝트 구조
- 여러 도구 예제
- 에러 처리
- 테스트 코드

#### templates/nodejs-mcp.md
완전한 Node.js MCP SDK 서버 템플릿:
- TypeScript 설정
- 타입 안전한 구현
- 프로젝트 구조
- 빌드 및 배포 설정

## 빠른 시작

### Python FastMCP

```bash
# 프로젝트 생성
mkdir my-mcp-server
cd my-mcp-server

# 가상환경 생성
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# FastMCP 설치
pip install fastmcp

# 서버 코드 작성 (server.py)
# ... SKILL.md의 예제 참고 ...

# 실행
python server.py
```

### Node.js MCP SDK

```bash
# 프로젝트 생성
mkdir my-mcp-server
cd my-mcp-server
npm init -y

# 의존성 설치
npm install @modelcontextprotocol/sdk
npm install -D @types/node typescript

# TypeScript 설정
npx tsc --init

# 서버 코드 작성 (src/index.ts)
# ... SKILL.md의 예제 참고 ...

# 빌드 및 실행
npm run build
npm start
```

## 예제 프로젝트

### 1. 날씨 API MCP 서버
외부 날씨 API를 통합하여 날씨 정보를 제공

### 2. 데이터베이스 쿼리 MCP 서버
SQL 데이터베이스 쿼리 실행 및 결과 반환

### 3. 파일 시스템 MCP 서버
파일 읽기, 쓰기, 검색 기능 제공

## 개발 워크플로우

1. **계획**: 어떤 도구가 필요한지 정의
2. **스캐폴딩**: 템플릿을 사용하여 기본 구조 생성
3. **구현**: 각 도구 함수 구현
4. **테스트**: 단위 테스트 작성 및 실행
5. **통합**: Claude Desktop에 MCP 서버 등록
6. **검증**: 실제 사용 시나리오 테스트

## 팁

- 작게 시작하여 점진적으로 기능 추가
- 각 도구는 명확한 단일 목적을 가져야 함
- 에러 처리를 철저히 하여 사용자 경험 개선
- 문서화를 통해 유지보수성 향상
- 버전 관리로 변경사항 추적

## 트러블슈팅

문제 발생 시:
1. SKILL.md의 트러블슈팅 섹션 참고
2. MCP 공식 문서 확인
3. 로깅을 활성화하여 디버깅

## 참고 자료

- [MCP 공식 문서](https://modelcontextprotocol.io/)
- [FastMCP GitHub](https://github.com/jlowin/fastmcp)
- [MCP SDK GitHub](https://github.com/modelcontextprotocol/sdk)
