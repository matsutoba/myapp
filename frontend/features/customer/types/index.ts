export interface Customer {
  id: number;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  company?: string | null;
  website?: string | null;
  tags?: string[];
  status?: string | null;
  ownerId?: number | null;
  lastContactedAt?: string | null;
  nextActionAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerRequest {
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  company?: string | null;
  website?: string | null;
  tags?: string[];
  status?: string | null;
  ownerId?: number | null;
  lastContactedAt?: string | null;
  nextActionAt?: string | null;
  notes?: string | null;
}

export interface UpdateCustomerRequest {
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string | null;
  website?: string | null;
  tags?: string[];
  status?: string | null;
  ownerId?: number | null;
  lastContactedAt?: string | null;
  nextActionAt?: string | null;
  notes?: string | null;
}
