import { UserRole } from '@prisma/client';
import { Router } from 'express';
import { authenticateToken, asyncHandler, requireRoles } from '../util/middleware';
import * as tournamentService from '../service/tournamentService';

export const competitionRouter = Router();

competitionRouter.get('/', asyncHandler(async (_req, res) => {
  res.status(200).json(await tournamentService.getCompetition());
}));

competitionRouter.get('/overview', asyncHandler(async (_req, res) => {
  res.status(200).json(await tournamentService.getOverview());
}));

competitionRouter.get('/bracket', asyncHandler(async (_req, res) => {
  res.status(200).json(await tournamentService.getBracket());
}));

competitionRouter.get('/rounds', asyncHandler(async (_req, res) => {
  res.status(200).json(await tournamentService.getRounds());
}));

competitionRouter.post('/rounds/:roundOrderNumber/simulate', authenticateToken, requireRoles(UserRole.ADMIN), asyncHandler(async (req, res) => {
  const roundOrderNumber = Number(req.params.roundOrderNumber);
  res.status(200).json(await tournamentService.simulateRound(roundOrderNumber, req.authUser!.role));
}));

competitionRouter.post('/reset-matches', authenticateToken, requireRoles(UserRole.ADMIN), asyncHandler(async (req, res) => {
  res.status(200).json(await tournamentService.resetMatches(req.authUser!.role));
}));
