/**
 * 테마 시스템 스토어
 * Svelte writable 스토어 기반 테마 관리
 */

import { writable } from 'svelte/store';

export type Theme =
  | 'default-light'
  | 'default-dark'
  | 'samsung-blue'
  | 'modern-dark'
  | 'elegant-light';

export interface ThemeInfo {
  id: Theme;
  name: string;
  description: string;
  preview: {
    primary: string;
    background: string;
    accent: string;
  };
}

export const themes: ThemeInfo[] = [
  {
    id: 'default-light',
    name: '기본 라이트',
    description: 'Default Light Theme',
    preview: {
      primary: '#1a1f37',
      background: '#ffffff',
      accent: '#f5f5f7'
    }
  },
  {
    id: 'default-dark',
    name: '기본 다크',
    description: 'Default Dark Theme',
    preview: {
      primary: '#e8e8ed',
      background: '#1a1f37',
      accent: '#3f4463'
    }
  },
  {
    id: 'samsung-blue',
    name: '삼성 블루',
    description: 'Samsung Professional',
    preview: {
      primary: '#1428A0',
      background: '#F8F9FA',
      accent: '#D4AF37'
    }
  },
  {
    id: 'modern-dark',
    name: '모던 다크',
    description: 'Premium Dark Mode',
    preview: {
      primary: '#6366F1',
      background: '#0A0E27',
      accent: '#F59E0B'
    }
  },
  {
    id: 'elegant-light',
    name: '엘레강트 라이트',
    description: 'Elegant Light Mode',
    preview: {
      primary: '#10B981',
      background: '#FFFFFF',
      accent: '#F472B6'
    }
  }
];

// 초기 테마 로드 (브라우저 환경에서만)
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'default-light';

  const savedTheme = localStorage.getItem('theme') as Theme | null;
  if (savedTheme && themes.some((t) => t.id === savedTheme)) {
    return savedTheme;
  }
  return 'default-light';
}

// 테마 적용 함수
export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;

  const html = document.documentElement;

  // 모든 테마 클래스 제거
  html.classList.remove('dark', 'samsung-blue', 'modern-dark', 'elegant-light');

  // 새 테마 적용
  if (theme === 'default-dark') {
    html.classList.add('dark');
  } else if (theme !== 'default-light') {
    html.classList.add(theme);
  }
}

// 테마 스토어 생성
function createThemeStore() {
  const { subscribe, set, update } = writable<Theme>(getInitialTheme());

  return {
    subscribe,
    setTheme: (theme: Theme) => {
      set(theme);
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', theme);
      }
      applyTheme(theme);
    },
    getThemeInfo: (theme: Theme): ThemeInfo | undefined => {
      return themes.find((t) => t.id === theme);
    }
  };
}

export const themeStore = createThemeStore();

// 초기 테마 적용
if (typeof window !== 'undefined') {
  applyTheme(getInitialTheme());
}
