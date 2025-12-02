import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);
dayjs.locale('ko');

/**
 * 지금 시간으로부터의 상대 시간을 한국어로 포맷팅 (예: "3분 전", "2시간 전", "5일 전")
 * @param date - Date 객체, ISO 문자열, 또는 타임스탬프
 * @returns 한국어 상대 시간 문자열
 */
export const relativeTimeFromNow = (date: Date | string | number): string => {
  return dayjs(date).fromNow();
};

/**
 * 분 단위 시간을 소요 시간 형식으로 한국어 포맷팅 (예: "15분 소요", "1시간 30분 소요")
 * @param minutes - 분 단위 소요 시간
 * @returns 한국어 소요 시간 문자열 또는 null
 */
export const formatMinutesToHoursMinutes = (
  minutes?: number,
  lang: string = 'ko',
): string => {
  const minSuffix = lang === 'ko' ? '분' : 'm';
  const hourSuffix = lang === 'ko' ? '시간' : 'h';
  if (!minutes || minutes <= 0) return `0${minSuffix}`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}${minSuffix}`;
  if (mins === 0) return `${hours}${hourSuffix}`;
  return `${hours}${hourSuffix} ${mins}${minSuffix}`;
};

/**
 * 날짜를 특정 포맷으로 변환
 * @param date - Date 객체, ISO 문자열, 또는 타임스탬프
 * @param format - dayjs 포맷 문자열 (기본값: 'YYYY-MM-DD')
 * @returns 포맷팅된 날짜 문자열
 */
export const formatDate = (
  date: Date | string | number,
  format: string = 'YYYY-MM-DD',
): string => {
  return dayjs(date).format(format);
};

/**
 * 시간을 특정 포맷으로 변환
 * @param date - Date 객체, ISO 문자열, 또는 타임스탬프
 * @param format - dayjs 포맷 문자열 (기본값: 'HH:mm')
 * @returns 포맷팅된 시간 문자열
 */
export const formatTime = (
  date: Date | string | number,
  format: string = 'HH:mm',
): string => {
  return dayjs(date).format(format);
};
