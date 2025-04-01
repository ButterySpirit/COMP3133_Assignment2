export interface User {
    id?: string; // optional for new users
    username: string;
    email: string;
    token?: string; // returned on login/signup
    created_at?: string;
    updated_at?: string;
  }
  