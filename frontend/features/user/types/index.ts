export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}
