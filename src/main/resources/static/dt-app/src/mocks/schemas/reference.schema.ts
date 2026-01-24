import { type Account } from './account';

export interface Reference {
  id: number;
  process: 'design' | 'development' | 'testing' | 'deployment';
  phase: string;
  type: 'local' | 'official';
  avail: 'Y' | 'N';
  createUser: Account;
  createDate: string;
}

export const referenceSchema = '++id, process, phase, type, avail, createDate';
