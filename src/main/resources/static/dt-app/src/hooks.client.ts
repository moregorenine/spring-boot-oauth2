import { worker } from '$lib/../mocks/browser';
import { base } from '$app/paths';
import { dev } from '$app/environment';

// 개발 환경(localhost)에서는 MSW를 비활성화
// 프로덕션 빌드(정적 사이트)에서만 MSW 실행
if (dev) {
  // 개발 환경에서는 기존 Service Worker를 모두 제거
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
        console.log('[DEV] Service Worker unregistered:', registration.scope);
      });
    });
  }
} else {
  // 프로덕션 환경에서만 MSW 실행
  worker.start({
    serviceWorker: {
      url: `${base}/mockServiceWorker.js`
    },
    onUnhandledRequest: 'bypass'
  });
}
