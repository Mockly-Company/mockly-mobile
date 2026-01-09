import z from 'zod';
import { Subscription } from '../subscription';

export const User = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  phoneNumber: z.string().nullish(),
});

export type User = z.infer<typeof User>;
export interface UserProfile {
  user: User;
  subscription: Subscription;
  isPhoneVerified: boolean;
}
