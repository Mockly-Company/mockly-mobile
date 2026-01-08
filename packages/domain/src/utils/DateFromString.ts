import { z } from 'zod';

export const DateFromString = z.string().transform(str => new Date(str));
