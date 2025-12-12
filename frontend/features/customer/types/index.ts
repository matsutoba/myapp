export interface Customer {
  id: number;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  company?: string | null;
  website?: string | null;
  tags?: string | string[] | null;
  status?: string | null;
  ownerId?: number | null;
  lastContactedAt?: string | null;
  nextActionAt?: string | null;
  notes?: string | null;
  customerRank?: string | null;
  rankUpdatedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerRequest {
  contactName: string;
  email: string;
  phone: string;
  address: string;
  company?: string | null;
  website?: string | null;
  tags?: string | string[] | null;
  status?: string | null;
  ownerId?: number | null;
  lastContactedAt?: string | null;
  nextActionAt?: string | null;
  notes?: string | null;
  customerRank?: string | null;
}

export interface UpdateCustomerRequest {
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string | null;
  website?: string | null;
  tags?: string | string[] | null;
  status?: string | null;
  ownerId?: number | null;
  lastContactedAt?: string | null;
  nextActionAt?: string | null;
  notes?: string | null;
  customerRank?: string | null;
}
