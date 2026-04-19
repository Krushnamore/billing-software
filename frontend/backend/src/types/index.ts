/**
 * types/index.ts — Shared TypeScript types
 */

export interface JwtPayload {
  uniqueId: string;
  email:    string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
