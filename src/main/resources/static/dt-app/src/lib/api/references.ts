import axios from 'axios';
import type { Reference } from '$lib/../mocks/db';

export interface CreateReferenceDto {
  process: string; // 사용자 입력 허용
  phase: string;
  type: 'local' | 'official';
  avail: 'Y' | 'N';
  // createUser는 백엔드에서 JWT 토큰으로 자동 주입
}

export interface UpdateReferenceDto {
  process?: string; // 사용자 입력 허용
  phase?: string;
  type?: 'local' | 'official';
  avail?: 'Y' | 'N';
  // createUser는 수정 불가
}

// References API
export const getReferences = async (): Promise<Reference[]> => {
  const response = await axios.get('/api/references');
  return response.data;
};

export const getReference = async (id: number): Promise<Reference> => {
  const response = await axios.get(`/api/references/${id}`);
  return response.data;
};

export const createReference = async (data: CreateReferenceDto): Promise<Reference> => {
  const response = await axios.post('/api/references', data);
  return response.data;
};

export const updateReference = async (id: number, data: UpdateReferenceDto): Promise<Reference> => {
  const response = await axios.put(`/api/references/${id}`, data);
  return response.data;
};

export const deleteReference = async (id: number): Promise<void> => {
  await axios.delete(`/api/references/${id}`);
};
