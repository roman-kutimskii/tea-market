export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export type ApiResponse = {
  access_token: string;
  refresh_token: string;
};

export type CreateUser = {
  email: string;
  role: string;
  password: string;
};

export type RegisterUser = {
  email: string;
  password: string;
};

export type Item = {
  id: number;
  saleToItems: string[];
};

export type SaleToItem = {
  id: number;
  quantity: number;
  item: Item;
  sale: string;
};

export type Sale = {
  id: number;
  seller: string;
  saleToItems: SaleToItem[];
};

export type RefreshToken = {
  id: number;
  token: string;
  user: string;
  expiresAt: string;
};

export type User = {
  id: number;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  sales: Sale[];
  refreshTokens: RefreshToken[];
};

export type ErrorResponse = {
  message: string;
  error: string;
  statusCode: number;
};
