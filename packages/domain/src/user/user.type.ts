import z from 'zod';
import { PlanType } from '../product';

export const User = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
});

export type User = z.infer<typeof User>;
export interface UserProfile {
  user: User;
  subscription: {
    id: string;
    name: string;
    planType: PlanType;
  };
}
