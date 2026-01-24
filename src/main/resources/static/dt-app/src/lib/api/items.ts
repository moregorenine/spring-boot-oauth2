import axios from 'axios';
import type { Item } from '$lib/../mocks/db';

export interface CreateItemDto {
  title: string;
  content: string;
}

export interface UpdateItemDto {
  title?: string;
  content?: string;
}

// Items API
export const getItems = async (): Promise<Item[]> => {
  const response = await axios.get('/api/items');
  return response.data;
};

export const getItem = async (id: number): Promise<Item> => {
  const response = await axios.get(`/api/items/${id}`);
  return response.data;
};

export const createItem = async (data: CreateItemDto): Promise<Item> => {
  const response = await axios.post('/api/items', data);
  return response.data;
};

export const updateItem = async (id: number, data: UpdateItemDto): Promise<Item> => {
  const response = await axios.put(`/api/items/${id}`, data);
  return response.data;
};

export const deleteItem = async (id: number): Promise<void> => {
  await axios.delete(`/api/items/${id}`);
};
