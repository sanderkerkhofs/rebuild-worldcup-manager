import { UserRole } from '@prisma/client';
import { Router } from 'express';
import { authenticateToken, asyncHandler, requireRoles } from '../util/middleware';
import * as userService from '../service/userService';

export const userRouter = Router();

userRouter.get('/', authenticateToken, requireRoles(UserRole.ADMIN), asyncHandler(async (_req, res) => {
  res.status(200).json(await userService.listUsers());
}));

userRouter.delete('/:userId', authenticateToken, requireRoles(UserRole.ADMIN), asyncHandler(async (req, res) => {
  res.status(200).json(await userService.deleteUser(String(req.params.userId), req.authUser!.id));
}));
