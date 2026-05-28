import { PlayerStatus, UserRole } from '@prisma/client';
import { Router } from 'express';
import { authenticateToken, asyncHandler, requireRoles } from '../util/middleware';
import * as playerService from '../service/playerService';

export const playerRouter = Router();

playerRouter.get('/', asyncHandler(async (_req, res) => {
  res.status(200).json(await playerService.listPlayers());
}));

playerRouter.get('/:playerId', asyncHandler(async (req, res) => {
  res.status(200).json(await playerService.getPlayer(String(req.params.playerId)));
}));

playerRouter.post('/', authenticateToken, requireRoles(UserRole.ADMIN), asyncHandler(async (req, res) => {
  res.status(201).json(await playerService.createPlayer(req.body));
}));

playerRouter.put('/:playerId', authenticateToken, requireRoles(UserRole.ADMIN), asyncHandler(async (req, res) => {
  res.status(200).json(await playerService.updatePlayer(String(req.params.playerId), req.body));
}));

playerRouter.patch('/:playerId/status', authenticateToken, requireRoles(UserRole.ADMIN), asyncHandler(async (req, res) => {
  res.status(200).json(await playerService.updatePlayerStatus(String(req.params.playerId), req.body.status as PlayerStatus));
}));

playerRouter.delete('/:playerId', authenticateToken, requireRoles(UserRole.ADMIN), asyncHandler(async (req, res) => {
  res.status(200).json(await playerService.deletePlayer(String(req.params.playerId)));
}));
