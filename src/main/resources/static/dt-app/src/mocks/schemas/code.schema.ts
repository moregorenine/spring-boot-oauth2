export interface Code {
  id?: number;
  group: string;
  code: string;
  name: string;
  sortOrder: number;
}

export const codeSchema = '++id, [group+code], group';
