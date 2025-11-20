# Google 로그인 설정 가이드

## 1. Google Cloud Console 설정

### 1.1 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택

### 1.2 OAuth 2.0 클라이언트 ID 생성

#### Android용 OAuth 클라이언트 ID

1. **API 및 서비스** > **사용자 인증 정보** 이동
2. **사용자 인증 정보 만들기** > **OAuth 클라이언트 ID** 클릭
3. 애플리케이션 유형: **Android** 선택
4. 패키지 이름 입력 (예: `com.mockly.mobile`)
5. SHA-1 인증서 지문 가져오기:

   ```bash
   # Debug 키스토어 (개발용)
   cd android/app
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

   # Release 키스토어 (프로덕션용)
   keytool -list -v -keystore your-release-key.keystore -alias your-key-alias
   ```

6. SHA-1 지문을 복사하여 입력

#### iOS용 OAuth 클라이언트 ID

1. **사용자 인증 정보 만들기** > **OAuth 클라이언트 ID** 클릭
2. 애플리케이션 유형: **iOS** 선택
3. 번들 ID 입력 (예: `com.mockly.mobile`)
4. App Store ID 입력 (선택사항)

#### 웹 클라이언트 ID (중요!)

1. **사용자 인증 정보 만들기** > **OAuth 클라이언트 ID** 클릭
2. 애플리케이션 유형: **웹 애플리케이션** 선택
3. 이름 입력 (예: `Mockly Web Client`)
4. **생성된 웹 클라이언트 ID를 복사** (이것이 `App.tsx`에서 사용할 ID입니다)

---

## 2. Android 네이티브 설정

### 2.1 `android/build.gradle` 수정

```gradle
buildscript {
    ext {
        buildToolsVersion = "34.0.0"
        minSdkVersion = 21
        compileSdkVersion = 34
        targetSdkVersion = 34
        ndkVersion = "26.1.10909125"
        kotlinVersion = "1.9.22"
    }
    // ... 나머지 설정
}
```

### 2.2 `android/app/build.gradle` 확인

```gradle
dependencies {
    // Google Play Services는 자동으로 추가됩니다
    implementation project(':react-native-google-signin_google-signin')
}
```

### 2.3 ProGuard 설정 (Release 빌드용)

`android/app/proguard-rules.pro`에 추가:

```proguard
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**
```

---

## 3. iOS 네이티브 설정

### 3.1 CocoaPods 설치

```bash
cd ios
pod install
cd ..
```

### 3.2 `ios/mobile/Info.plist` 수정

`</dict>` 바로 위에 다음 추가:

```xml
<!-- Google Sign-In -->
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleTypeRole</key>
    <string>Editor</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <!-- iOS 클라이언트 ID를 역순으로 입력 -->
      <!-- 예: com.googleusercontent.apps.123456789-abcdefg -->
      <string>com.googleusercontent.apps.YOUR-IOS-CLIENT-ID</string>
    </array>
  </dict>
</array>

<!-- Google Sign-In 화이트리스트 -->
<key>LSApplicationQueriesSchemes</key>
<array>
  <string>googlegmail</string>
  <string>googlemail</string>
</array>
```

### 3.3 `ios/mobile/AppDelegate.mm` 수정

파일 상단에 import 추가:

```objective-c
#import <GoogleSignIn/GoogleSignIn.h>
```

`application:openURL:options:` 메서드 추가:

```objective-c
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  return [GIDSignIn.sharedInstance handleURL:url];
}
```

---

## 4. App.tsx 환경 변수 설정

### 4.1 `.env` 파일 생성 (권장)

프로젝트 루트에 `.env` 파일 생성:

```env
GOOGLE_WEB_CLIENT_ID=YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
GOOGLE_IOS_CLIENT_ID=YOUR_IOS_CLIENT_ID.apps.googleusercontent.com
```

### 4.2 `App.tsx`에서 사용

```typescript
import Config from 'react-native-dotenv';

const GOOGLE_WEB_CLIENT_ID = Config.GOOGLE_WEB_CLIENT_ID;
const GOOGLE_IOS_CLIENT_ID = Config.GOOGLE_IOS_CLIENT_ID;
```

또는 직접 입력:

```typescript
// App.tsx 14-15번 줄 수정
const GOOGLE_WEB_CLIENT_ID = '123456789-abcdefg.apps.googleusercontent.com';
const GOOGLE_IOS_CLIENT_ID = '987654321-hijklmn.apps.googleusercontent.com';
```

---

## 5. 빌드 및 실행

### Android

```bash
# 캐시 정리 (선택사항)
cd android
./gradlew clean
cd ..

# 실행
npm run android
# 또는
pnpm android
```

### iOS

```bash
# Pod 재설치
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..

# 실행
npm run ios
# 또는
pnpm ios
```

---

## 6. 트러블슈팅

### Android 관련

#### "DEVELOPER_ERROR" 발생

- SHA-1 지문이 정확한지 확인
- Google Cloud Console에서 올바른 패키지명 사용 확인
- 웹 클라이언트 ID를 사용하고 있는지 확인

#### "Google Play Services not available"

- 에뮬레이터에 Google Play Services가 설치되어 있는지 확인
- 실제 기기에서 테스트

### iOS 관련

#### "No application bundle URL provided"

- `Info.plist`에 `CFBundleURLSchemes` 올바르게 설정되었는지 확인
- iOS 클라이언트 ID가 역순으로 입력되었는지 확인

#### "The operation couldn't be completed"

- Xcode에서 Bundle Identifier가 Google Cloud Console의 번들 ID와 일치하는지 확인
- Pod 재설치 후 재빌드

### 공통 문제

#### "webClientId is required"

- `App.tsx`에서 올바른 웹 클라이언트 ID 사용 확인
- Android/iOS 클라이언트 ID가 아닌 **웹 클라이언트 ID** 사용

---

## 7. 참고 자료

- [공식 문서](https://react-native-google-signin.github.io/docs/)
- [Google OAuth 2.0 설정](https://developers.google.com/identity/protocols/oauth2)
- [Android 설정 가이드](https://developers.google.com/identity/sign-in/android/start-integrating)
- [iOS 설정 가이드](https://developers.google.com/identity/sign-in/ios/start-integrating)

---

## 8. 보안 주의사항

1. **클라이언트 ID를 소스 코드에 하드코딩하지 마세요**
   - 환경 변수 또는 설정 파일 사용
   - `.env` 파일을 `.gitignore`에 추가

2. **Release 빌드 시 별도의 OAuth 클라이언트 사용**
   - Debug용 SHA-1과 Release용 SHA-1이 다름
   - 각각에 대한 OAuth 클라이언트 생성

3. **서버 측 검증 구현**
   - 클라이언트에서 받은 ID 토큰을 서버에서 검증
   - Google의 토큰 검증 API 사용

---

## 9. 테스트 체크리스트

- [ ] Google Cloud Console에서 프로젝트 생성
- [ ] Android, iOS, 웹 OAuth 클라이언트 ID 모두 생성
- [ ] SHA-1 지문 등록 (Android Debug & Release)
- [ ] `App.tsx`에 올바른 웹 클라이언트 ID 입력
- [ ] Android 네이티브 설정 완료
- [ ] iOS 네이티브 설정 완료 (`Info.plist`, `AppDelegate.mm`)
- [ ] Pod 설치 완료 (iOS)
- [ ] 앱 빌드 및 실행 성공
- [ ] 로그인 버튼 클릭 시 Google 로그인 화면 표시
- [ ] 로그인 성공 후 사용자 정보 표시
- [ ] 로그아웃 기능 작동
