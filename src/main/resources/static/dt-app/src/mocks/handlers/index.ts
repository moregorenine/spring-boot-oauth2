import { itemHandlers } from './items';
import { referenceHandlers } from './references';
import { authHandlers } from './auth';

export const handlers = [...itemHandlers, ...referenceHandlers, ...authHandlers];
