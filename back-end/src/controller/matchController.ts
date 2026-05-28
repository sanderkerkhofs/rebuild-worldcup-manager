import { MatchStatus, UserRole } from '@prisma/client';
import { Router } from 'express';
import { authenticateToken, asyncHandler, requireRoles } from '../util/middleware';
import * as matchService from '../service/matchService';

export const matchRouter = Router();

matchRouter.get('/', asyncHandler(async (_req, res) => {
  res.status(200).json(await matchService.listMatches());
}));

matchRouter.get('/top-scorers', asyncHandler(async (_req, res) => {
  res.status(200).json(await matchService.topScorers());
}));

matchRouter.get('/:matchId', asyncHandler(async (req, res) => {
  res.status(200).json(await matchService.getMatch(String(req.params.matchId)));
}));

matchRouter.patch('/:matchId/status', authenticateToken, requireRoles(UserRole.ADMIN, UserRole.REFEREE), asyncHandler(async (req, res) => {
  const actor = { id: req.authUser!.id, role: req.authUser!.role };
  const status = req.body.status as MatchStatus;
  res.status(200).json(await matchService.updateMatchStatus(String(req.params.matchId), status, actor));
}));

matchRouter.put('/:matchId/result', authenticateToken, requireRoles(UserRole.ADMIN, UserRole.REFEREE), asyncHandler(async (req, res) => {
  const actor = { id: req.authUser!.id, role: req.authUser!.role };
  res.status(200).json(await matchService.updateMatchResult(String(req.params.matchId), Number(req.body.homeScore), Number(req.body.awayScore), actor));
}));

matchRouter.post('/:matchId/goals', authenticateToken, requireRoles(UserRole.ADMIN, UserRole.REFEREE), asyncHandler(async (req, res) => {
  const actor = { id: req.authUser!.id, role: req.authUser!.role };
  res.status(201).json(await matchService.addGoal(String(req.params.matchId), req.body.playerId, req.body.teamId, actor));
}));

matchRouter.patch('/:matchId/goals/:goalId', authenticateToken, requireRoles(UserRole.ADMIN, UserRole.REFEREE), asyncHandler(async (req, res) => {
  const actor = { id: req.authUser!.id, role: req.authUser!.role };
  res.status(200).json(await matchService.updateGoal(String(req.params.matchId), String(req.params.goalId), req.body.playerId, req.body.teamId, actor));
}));
