import { apiClient } from '../client';

type RequestDTO = {
  phoneNumber: string;
  code: string;
  deviceId: string;
};

export const postOTPVerification = async (req: RequestDTO) => {
  const res = await apiClient.post<null>('/api/auth/phone/verify', req).catch(err => {
    throw err;
    // 테스트 위해 남겨두기
    // err.isAxiosError = true;
    // err.response = {
    //   data: {
    //     data: null,
    //     success: false,
    //     error: 'INVALID_CODE',
    //     message: '인증 번호가 일치하지 않습니다. (남은 시도: 4회)',
    //   },
    //   headers: {},
    //   status: 500,
    //   statusText: '',
    // };

    // throw err;
    return {
      success: true,
    };
  });

  return res.success;
};
