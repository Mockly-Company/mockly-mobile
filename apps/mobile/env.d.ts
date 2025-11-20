/**
 * 환경 변수 타입 정의
 * react-native-dotenv 모듈에서 가져오는 환경 변수들의 타입을 선언합니다.
 */
declare module '@env' {
  export const GOOGLE_WEB_CLIENT_ID: string;
  export const GOOGLE_IOS_CLIENT_ID: string;
  export const GOOGLE_ANDROID_CLIENT_ID: string;
  export const API_BASE_URL: string;
}
