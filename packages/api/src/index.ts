export * from './client';
export * from './types';
import * as auth from './auth';
import * as user from './user';
import * as payment from './payment';
import * as subscription from './subscription';
import * as product from './product';

export const api = { auth, user, payment, subscription, product };
export default api;
