/**
 * 인증 API
 * Spring Boot JWT 인증 서버와 통신
 */

import axios from 'axios';
import type { LoginRequest, LoginResponse } from '$lib/types/auth.types';
import type { Account } from '$lib/../mocks/schemas/account';

/**
 * 로그인
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>('/api/auth/login', credentials);
  return response.data;
};

/**
 * 로그아웃
 */
export const logout = async (): Promise<void> => {
  await axios.post('/api/auth/logout');
};

/**
 * JWT 토큰 유효성 검증
 */
export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const response = await axios.get<{ valid: boolean }>('/api/auth/validate', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.valid;
  } catch {
    return false;
  }
};

/**
 * 현재 사용자 정보 조회
 */
export const getCurrentUser = async (): Promise<Account> => {
  const response = await axios.get<Account>('/api/auth/me');
  return response.data;
};
