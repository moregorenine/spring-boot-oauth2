import Dexie, { type EntityTable } from 'dexie';
import { type Item, itemSchema } from './schemas/item.schema';
import { type Reference, referenceSchema } from './schemas/reference.schema';
import { type Code, codeSchema } from './schemas/code.schema';

// Re-export types for convenience
export type { Item, Reference, Code };

export class AppDB extends Dexie {
  items!: EntityTable<Item, 'id'>;
  references!: EntityTable<Reference, 'id'>;
  codes!: EntityTable<Code, 'id'>;

  constructor() {
    super('app-db');
    this.version(1).stores({
      items: itemSchema
    });
    this.version(2).stores({
      items: itemSchema,
      references: referenceSchema
    });
    // type 필드 추가를 위한 버전 업그레이드
    this.version(3).stores({
      items: itemSchema,
      references: referenceSchema
    });
    this.version(4).stores({
      items: itemSchema,
      references: referenceSchema,
      codes: codeSchema
    });

    this.on('populate', () => {
      this.codes.bulkAdd([
        { group: 'PROCESS', code: 'DESIGN', name: 'Design', sortOrder: 1 },
        { group: 'PROCESS', code: 'DEVELOPMENT', name: 'Development', sortOrder: 2 },
        { group: 'PROCESS', code: 'TESTING', name: 'Testing', sortOrder: 3 },
        { group: 'PROCESS', code: 'DEPLOYMENT', name: 'Deployment', sortOrder: 4 },
        { group: 'AVAIL', code: 'Y', name: 'Yes', sortOrder: 1 },
        { group: 'AVAIL', code: 'N', name: 'No', sortOrder: 2 }
      ]);
    });
  }
}

export const db = new AppDB();
