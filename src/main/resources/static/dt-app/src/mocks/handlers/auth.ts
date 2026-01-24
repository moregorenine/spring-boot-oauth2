/**
 * MSW 인증 핸들러
 * 개발 환경에서 JWT 인증을 시뮬레이션
 */

import { http, HttpResponse } from 'msw';
import type { LoginRequest, LoginResponse } from '$lib/types/auth.types';
import type { Account } from '../schemas/account';

// Mock 사용자 데이터
const mockUsers: Account[] = [
  {
    id: 1,
    username: 'Test User',
    email: 'test@example.com',
    password: 'password123', // 실제로는 해시된 비밀번호 사용
    deptName: 'Development',
    deptId: 'DEPT001',
    loginId: 'testuser',
    createDate: new Date('2024-01-01'),
    updateDate: new Date('2024-01-01'),
    latestLoginDate: new Date()
  },
  {
    id: 2,
    username: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    deptName: 'Administration',
    deptId: 'DEPT002',
    loginId: 'admin',
    createDate: new Date('2024-01-01'),
    updateDate: new Date('2024-01-01'),
    latestLoginDate: new Date()
  }
];

// Mock JWT 토큰 생성 (실제로는 서버에서 생성)
function generateMockToken(loginId: string): string {
  return `mock-jwt-token-${loginId}-${Date.now()}`;
}

export const authHandlers = [
  // POST /api/auth/login - 로그인
  http.post('/api/auth/login', async ({ request }) => {
    const credentials = (await request.json()) as LoginRequest;

    // 사용자 찾기
    const user = mockUsers.find(
      (u) => u.loginId === credentials.loginId && u.password === credentials.password
    );

    if (!user) {
      return new HttpResponse(null, {
        status: 401,
        statusText: 'Invalid credentials'
      });
    }

    // 비밀번호 제거 (응답에 포함하지 않음)
    const { password, ...userWithoutPassword } = user;

    const response: LoginResponse = {
      token: generateMockToken(user.loginId!),
      user: { ...userWithoutPassword, password: null }
    };

    return HttpResponse.json(response);
  }),

  // POST /api/auth/logout - 로그아웃
  http.post('/api/auth/logout', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // GET /api/auth/validate - 토큰 유효성 검증
  http.get('/api/auth/validate', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ valid: false }, { status: 401 });
    }

    // Mock 토큰 검증 (실제로는 JWT 검증)
    const token = authHeader.substring(7);
    const isValid = token.startsWith('mock-jwt-token-');

    return HttpResponse.json({ valid: isValid });
  }),

  // GET /api/auth/me - 현재 사용자 정보 조회
  http.get('/api/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 });
    }

    // Mock: 첫 번째 사용자 반환
    const { password, ...userWithoutPassword } = mockUsers[0];
    return HttpResponse.json(userWithoutPassword);
  })
];
