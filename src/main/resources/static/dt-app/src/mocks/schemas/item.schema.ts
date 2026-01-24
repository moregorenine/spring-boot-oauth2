export interface Item {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export const itemSchema = '++id, title, createdAt';
