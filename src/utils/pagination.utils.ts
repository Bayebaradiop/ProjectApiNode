// src/utils/pagination.utils.ts
import { Request } from 'express';

export function getPaginationParams(req: Request) {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 5;
  return { page, pageSize };
}