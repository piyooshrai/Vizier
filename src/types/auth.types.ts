export interface SignupData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  role: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export interface PasswordChangeData {
  current_password: string;
  new_password: string;
}
