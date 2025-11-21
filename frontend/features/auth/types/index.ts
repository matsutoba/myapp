export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
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
  role?: string;
}
