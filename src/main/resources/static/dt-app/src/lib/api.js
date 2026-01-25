// JWT 토큰을 자동으로 포함하는 API 클라이언트
import { auth } from '$lib/stores/auth';
import { get } from 'svelte/store';

/**
 * API 요청 헬퍼 함수
 * 자동으로 JWT 토큰을 Authorization 헤더에 포함
 */
export async function apiRequest(url, options = {}) {
  const token = auth.getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  // JWT 토큰이 있으면 Authorization 헤더에 추가
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    // 401 Unauthorized - 토큰 만료 또는 유효하지 않음
    if (response.status === 401) {
      console.warn('Unauthorized request, logging out...');
      await auth.logout();
      throw new Error('Unauthorized');
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * GET 요청
 */
export async function apiGet(url) {
  const response = await apiRequest(url, {
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error(`GET ${url} failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * POST 요청
 */
export async function apiPost(url, data) {
  const response = await apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`POST ${url} failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * PUT 요청
 */
export async function apiPut(url, data) {
  const response = await apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`PUT ${url} failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * DELETE 요청
 */
export async function apiDelete(url) {
  const response = await apiRequest(url, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error(`DELETE ${url} failed: ${response.statusText}`);
  }

  return response.json();
}
