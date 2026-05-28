import { NextFunction, Request, Response } from 'express';
import { UserRole } from '@prisma/client';
import { verifyAuthToken } from './jwt';
import { AppError } from './errors';

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        id: string;
        username: string;
        role: UserRole;
        teamId: string | null;
      };
    }
  }
}

export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

export function authenticateToken(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized', 401));
  }

  const token = header.replace('Bearer ', '').trim();
  const payload = verifyAuthToken(token);

  req.authUser = {
    id: payload.sub,
    username: payload.username,
    role: payload.role as UserRole,
    teamId: payload.teamId
  };

  return next();
}

export function requireRoles(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.authUser) {
      return next(new AppError('Unauthorized', 401));
    }

    if (!roles.includes(req.authUser.role)) {
      return next(new AppError('Forbidden', 403));
    }

    return next();
  };
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  return res.status(500).json({ message: 'Internal server error' });
}
