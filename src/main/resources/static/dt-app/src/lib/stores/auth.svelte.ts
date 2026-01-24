/**
 * 인증 상태 관리 스토어
 * Svelte 5 runes 기반 전역 상태 관리
 */

import type { Account } from '$lib/../mocks/schemas/account';

class AuthStore {
  currentUser = $state<Account | null>(null);
  token = $state<string | null>(null);

  // 인증 여부를 자동으로 계산
  isAuthenticated = $derived(this.currentUser !== null && this.token !== null);

  /**
   * 인증 정보 설정 및 localStorage에 저장
   */
  setAuth(user: Account, token: string) {
    this.currentUser = user;
    this.token = token;

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('current_user', JSON.stringify(user));
    }
  }

  /**
   * 인증 정보 제거 및 localStorage 클리어
   */
  clearAuth() {
    this.currentUser = null;
    this.token = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
    }
  }

  /**
   * 페이지 로드 시 localStorage에서 인증 정보 복원
   */
  loadFromStorage() {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('current_user');

    if (token && userStr) {
      try {
        this.token = token;
        this.currentUser = JSON.parse(userStr);
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
        this.clearAuth();
      }
    }
  }

  /**
   * 현재 사용자의 간단한 정보 반환 (Reference createUser 형식)
   */
  getUserInfo() {
    if (!this.currentUser) return null;

    return {
      id: this.currentUser.loginId || '',
      name: this.currentUser.username || '',
      email: this.currentUser.email || ''
    };
  }
}

export const authStore = new AuthStore();
