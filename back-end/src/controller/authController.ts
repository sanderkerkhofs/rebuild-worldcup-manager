import { Router } from 'express';
import { authenticateToken, asyncHandler } from '../util/middleware';
import * as authService from '../service/authService';

export const authRouter = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register user account
 */
authRouter.post('/register', asyncHandler(async (req, res) => {
  const result = await authService.register(req.body.username || '', req.body.password || '');
  res.status(201).json(result);
}));

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login user
 */
authRouter.post('/login', asyncHandler(async (req, res) => {
  const result = await authService.login(req.body.username || '', req.body.password || '');
  res.status(200).json(result);
}));

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 */
authRouter.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  const result = await authService.me(req.authUser!.id);
  res.status(200).json(result);
}));
