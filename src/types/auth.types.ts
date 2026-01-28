export interface SignupData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  role: string;
  organization_name: string;
  invite_token?: string;
  is_active?: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  organization_id?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  last_login_at?: string;
}

export interface PasswordChangeData {
  current_password: string;
  new_password: string;
}
