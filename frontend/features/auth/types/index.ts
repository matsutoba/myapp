export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    name?: string;
  };
}

export interface AuthError {
  message: string;
  code?: string;
}

export interface User {
  id: number;
  email: string;
  name?: string;
}
