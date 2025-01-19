import { Request } from 'express';
import { Role } from './enums/role.enum';

export type CustomRequest = Request & { user: Record<string, unknown> };
export type CustomRequestWithRole = CustomRequest & {
  user: Record<string, unknown> & { role: Role };
};
