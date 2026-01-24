import { writable } from 'svelte/store';

interface WindowInstance {
  id: string;
  overlayElement: HTMLElement | null;
  zIndex: number;
}

// Body scroll lock 관리를 위한 전역 상태
let previousBodyOverflow = '';
let lockCount = 0;

function lockBodyScroll() {
  if (typeof document !== 'undefined' && lockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  lockCount++;
}

function unlockBodyScroll() {
  lockCount--;
  if (typeof document !== 'undefined' && lockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
  }
}

// 기본 z-index (모달 등이 이 값보다 높게 설정될 수 있음)
const BASE_Z_INDEX = 50;

function createWindowStack() {
  const { subscribe, update } = writable<WindowInstance[]>([]);

  return {
    subscribe,
    register: (id: string, overlayElement: HTMLElement | null, isModal: boolean = true) => {
      if (isModal) {
        lockBodyScroll();
      }
      update((stack) => {
        // 현재 스택에서 가장 높은 z-index 찾기
        const maxZIndex = stack.reduce((max, window) => Math.max(max, window.zIndex), BASE_Z_INDEX);
        // 새 윈도우는 가장 높은 z-index + 1
        return [...stack, { id, overlayElement, zIndex: maxZIndex + 1 }];
      });
    },
    unregister: (id: string, isModal: boolean = true) => {
      if (isModal) {
        unlockBodyScroll();
      }
      update((stack) => {
        const filtered = stack.filter((w) => w.id !== id);
        // 다른 윈도우가 있으면 가장 최근 윈도우로 포커스 이동
        if (filtered.length > 0) {
          const lastWindow = filtered[filtered.length - 1];
          if (lastWindow.overlayElement) {
            // 약간의 지연을 두고 포커스 이동 (DOM 업데이트 대기)
            setTimeout(() => {
              lastWindow.overlayElement?.focus();
            }, 50);
          }
        }
        return filtered;
      });
    },
    // 특정 윈도우를 최상위로 가져오기
    bringToFront: (id: string) => {
      update((stack) => {
        const window = stack.find((w) => w.id === id);
        if (!window) return stack;

        // 이미 최상위인지 확인
        const maxZIndex = stack.reduce((max, w) => Math.max(max, w.zIndex), BASE_Z_INDEX);
        if (window.zIndex === maxZIndex) return stack;

        // 해당 윈도우의 z-index를 max + 1로 업데이트
        return stack.map((w) => (w.id === id ? { ...w, zIndex: maxZIndex + 1 } : w));
      });
    },
    // 특정 윈도우의 z-index 가져오기 (초기값 용도 등)
    getZIndex: (id: string): number => {
      let zIndex = BASE_Z_INDEX;
      const unsubscribe = subscribe((stack) => {
        const window = stack.find((w) => w.id === id);
        if (window) zIndex = window.zIndex;
      });
      unsubscribe();
      return zIndex;
    },
    clear: () => update(() => [])
  };
}

export const windowStack = createWindowStack();
