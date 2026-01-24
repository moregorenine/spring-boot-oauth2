/**
 * Axios 전역 설정
 * JWT 토큰 자동 추가 및 401 에러 처리
 */

import axios from 'axios';
import { authStore } from '$lib/stores/auth.svelte';

// Request Interceptor: 모든 요청에 JWT 토큰 자동 추가
axios.interceptors.request.use(
  (config) => {
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: 401 에러 시 자동 로그아웃 처리
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 인증 실패 시 로그아웃 처리
      authStore.clearAuth();

      // 로그인 페이지로 리다이렉트 (브라우저 환경에서만)
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
