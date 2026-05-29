import { Router } from 'express';
import { authenticateToken, asyncHandler } from '../util/middleware';
import * as authService from '../service/authService';

export const authRouter = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register user account
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       '201':
 *         description: User created and authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '409':
 *         $ref: '#/components/responses/Conflict'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
authRouter.post('/register', asyncHandler(async (req, res) => {
  const result = await authService.register(req.body.username || '', req.body.password || '');
  res.status(201).json(result);
}));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       '200':
 *         description: Authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
authRouter.post('/login', asyncHandler(async (req, res) => {
  const result = await authService.login(req.body.username || '', req.body.password || '');
  res.status(200).json(result);
}));

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get current user profile
 *     responses:
 *       '200':
 *         description: Current authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SafeUser'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
authRouter.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  const result = await authService.me(req.authUser!.id);
  res.status(200).json(result);
}));
