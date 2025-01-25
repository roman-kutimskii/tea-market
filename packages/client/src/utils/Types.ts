export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

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
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type ErrorResponse = {
  message: string;
  error: string;
  statusCode: number;
};

export type GetSaleItem = {
  itemId: number;
  quantity: number;
};

export type GetSale = {
  id: number;
  saleToItems: GetSaleItem[];
};

export type Item = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  type: string;
  originCountry: string;
  region: string;
  harvestYear: number;
  manufacturer: string;
};

export type SaleItem = {
  item: Item;
  quantity: number;
};

export type Sale = {
  id: number;
  saleToItems: SaleItem[];
};

export type ResponceItemType = Omit<Item, "price"> & { price: string };

export type GetItemsType = {
  items: ResponceItemType[];
  count: number;
};