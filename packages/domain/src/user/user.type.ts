export interface User {
  id: string;
  email: string;
  name: string;
}

export interface UserProfile {
  user: User;
  subscription: {
    id: string;
    name: string;
    planType: 'FREE' | 'PREMIUM' | 'PRO' | 'BASIC';
  };
}
