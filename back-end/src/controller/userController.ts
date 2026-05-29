import { UserRole } from '@prisma/client';
import { Router } from 'express';
import { authenticateToken, asyncHandler, requireRoles } from '../util/middleware';
import * as userService from '../service/userService';

export const userRouter = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: List users (admin only)
 *     responses:
 *       '200':
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserListItem'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
userRouter.get('/', authenticateToken, requireRoles(UserRole.ADMIN), asyncHandler(async (_req, res) => {
  res.status(200).json(await userService.listUsers());
}));

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user (admin only)
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to delete
 *     responses:
 *       '200':
 *         description: User deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
userRouter.delete('/:userId', authenticateToken, requireRoles(UserRole.ADMIN), asyncHandler(async (req, res) => {
  res.status(200).json(await userService.deleteUser(String(req.params.userId), req.authUser!.id));
}));
