## PKCE 구글 로그인 과정

```mermaid
sequenceDiagram
    title PKCE 구글 로그인 과정
    participant User
    participant App
    participant Google
    participant Backend

    User->>App: 구글 로그인 클릭
    App->>Google: PKCE 로그인 요청 (code_challenge)
    Google->>User: 로그인 & 동의 화면
    User->>Google: 계정 선택 및 동의
    Google->>App: Authorization Code 반환

    App->>Backend: POST /api/auth/login/google<br/>(code, code_verifier, device_uid)
    Backend->>Google: Token 교환 요청 (code + verifier)
    Google->>Backend: Google Access Token

    Backend->>Backend: 사용자 검증 / 계정 생성
    Backend->>App: ACCESS + REFRESH 토큰 발급

    App->>Backend: GET /api/auth/me (ACCESS)
    Backend->>App: 사용자 프로필 응답

```

## 인증 만료시 Token Refresh 재인증 과정

```mermaid
sequenceDiagram
    title 인증 만료시 Token Refresh 처리 과정
    participant App
    participant Backend

    App->>Backend: API 요청 (ACCESS)
    Backend-->>App: 401 TOKEN_EXPIRED

    Note over App: refreshInProgress = true

    App->>Backend: POST /api/auth/refresh (REFRESH)

    par Refresh 중 추가 요청/에러 발생
        App->>App: (추가된 401 에러난 요청들), (새로 추가된 요청들) =>  Promise resolve를 Queue에 저장
    end

    alt Refresh 성공
        Backend->>App: 새로운 ACCESS 토큰
        Note over App: refreshInProgress = false

        loop Queue에 쌓인 요청들
            App->>Backend: 보류된 API 재요청 (새 ACCESS)
            Backend->>App: 정상 응답
        end

    else Refresh 실패 (REFRESH 만료)
        Backend-->>App: 401 TOKEN_EXPIRED
        Note over App: Queue 비움, reject처리
        App->>App: Logout 처리
    end
```

## 앱 다시 시작시 인증 과정

```mermaid
sequenceDiagram
    title 앱 다시 시작시 인증 과정
    participant App
    participant Backend

    App->>App: 저장된 ACCESS / REFRESH 로드
    App->>Backend: GET /api/auth/me (ACCESS)

    alt ACCESS 유효
        Backend->>App: 사용자 프로필
    else ACCESS 만료
        Backend-->>App: 401 TOKEN_EXPIRED
        App->>Backend: POST /api/auth/refresh (REFRESH)

        alt Refresh 성공
            Backend->>App: 새로운 ACCESS 토큰
            App->>Backend: GET /api/auth/me 재요청
            Backend->>App: 사용자 프로필
        else Refresh 실패
            Backend-->>App: 401 TOKEN_EXPIRED
            App->>App: Logout 처리
        end
    end
```

## 참고 자료

- [RFC 7636: PKCE](https://tools.ietf.org/html/rfc7636)
- [OAuth 2.0 for Native Apps](https://tools.ietf.org/html/rfc8252)
- [react-native-app-auth](https://github.com/FormidableLabs/react-native-app-auth)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
