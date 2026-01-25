// JWT 토큰과 사용자 정보를 관리하는 Svelte Store
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const TOKEN_KEY = 'jwt_token';

function createAuthStore() {
  const { subscribe, set, update } = writable({
    user: null,
    loading: true,
    authenticated: false,
    token: null
  });

  return {
    subscribe,

    /**
     * JWT 토큰 초기화 (localStorage에서 로드)
     */
    init() {
      if (browser) {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
          this.setToken(token);
          this.loadUser();
        } else {
          set({ user: null, loading: false, authenticated: false, token: null });
        }
      }
    },

    /**
     * JWT 토큰 설정
     */
    setToken(token) {
      if (browser) {
        localStorage.setItem(TOKEN_KEY, token);
        update((state) => ({ ...state, token, loading: true }));
      }
    },

    /**
     * JWT 토큰 가져오기
     */
    getToken() {
      if (browser) {
        return localStorage.getItem(TOKEN_KEY);
      }
      return null;
    },

    /**
     * 사용자 정보 로드
     */
    async loadUser() {
      const token = this.getToken();

      if (!token) {
        set({ user: null, loading: false, authenticated: false, token: null });
        return;
      }

      try {
        const response = await fetch('/api/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const user = await response.json();
          set({ user, loading: false, authenticated: true, token });
        } else {
          // 토큰이 유효하지 않으면 삭제
          this.logout();
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        this.logout();
      }
    },

    /**
     * 인증 상태 확인
     */
    async checkAuthStatus() {
      const token = this.getToken();

      if (!token) {
        return false;
      }

      try {
        const response = await fetch('/api/auth/status', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          return data.authenticated;
        }
      } catch (error) {
        console.error('Failed to check auth status:', error);
      }

      return false;
    },

    /**
     * 로그아웃
     */
    async logout() {
      const token = this.getToken();

      if (token) {
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } catch (error) {
          console.error('Logout failed:', error);
        }
      }

      if (browser) {
        localStorage.removeItem(TOKEN_KEY);
      }

      set({ user: null, loading: false, authenticated: false, token: null });

      // 로그인 페이지로 리다이렉트
      if (browser) {
        window.location.href = '/';
      }
    },

    /**
     * 초기화
     */
    reset() {
      if (browser) {
        localStorage.removeItem(TOKEN_KEY);
      }
      set({ user: null, loading: true, authenticated: false, token: null });
    }
  };
}

export const auth = createAuthStore();
