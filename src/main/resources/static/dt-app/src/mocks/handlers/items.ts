import { http, HttpResponse } from 'msw';
import { db, type Item } from '../db';

export const itemHandlers = [
  // GET /api/items - 목록 조회
  http.get('/api/items', async () => {
    const items = await db.items.toArray();
    return HttpResponse.json(items);
  }),

  // GET /api/items/:id - 단건 조회
  http.get('/api/items/:id', async ({ params }) => {
    const { id } = params;
    const item = await db.items.get(Number(id));

    if (!item) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(item);
  }),

  // POST /api/items - 등록
  http.post('/api/items', async ({ request }) => {
    const body = (await request.json()) as Omit<Item, 'id' | 'createdAt'>;
    const id = await db.items.add({
      ...body,
      createdAt: new Date().toISOString()
    } as any);

    const newItem = await db.items.get(id);
    return HttpResponse.json(newItem, { status: 201 });
  }),

  // PUT /api/items/:id - 수정
  http.put('/api/items/:id', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Partial<Omit<Item, 'id' | 'createdAt'>>;

    const existingItem = await db.items.get(Number(id));
    if (!existingItem) {
      return new HttpResponse(null, { status: 404 });
    }

    await db.items.update(Number(id), body);
    const updatedItem = await db.items.get(Number(id));

    return HttpResponse.json(updatedItem);
  }),

  // DELETE /api/items/:id - 삭제
  http.delete('/api/items/:id', async ({ params }) => {
    const { id } = params;

    const existingItem = await db.items.get(Number(id));
    if (!existingItem) {
      return new HttpResponse(null, { status: 404 });
    }

    await db.items.delete(Number(id));
    return new HttpResponse(null, { status: 204 });
  })
];
