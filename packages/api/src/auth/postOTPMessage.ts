import z from 'zod';
import { apiClient } from '../client';

type RequestDTO = {
  phoneNumber: string;
};
const RequestDTO = z.object({
  phoneNumber: z.string(),
});

type ResponseDTO = {
  expiresIn: 180; // OTP 유효시간 (3분, 초 단위)
  canResendAfter: 30; // 재전송 가능 시간 (30초, 초 단위)
  isFirstTime: boolean; // 최초 인증 여부
};

export const postOTPMessage = async (req: RequestDTO) => {
  const res = await apiClient.post<ResponseDTO>('/api/auth/phone/send', req).catch(() => {
    // TODO: API 없어서 Mock. MSW 추가 예정
    return {
      data: {
        expiresIn: 180,
        canResendAfter: 30,
        isFirstTime: true,
      },
    };
  });

  return res.data;
};
