import { UserRole } from '@prisma/client';
import { Router } from 'express';
import { authenticateToken, asyncHandler, requireRoles } from '../util/middleware';
import * as tournamentService from '../service/tournamentService';

export const competitionRouter = Router();

/**
 * @swagger
 * /api/competition:
 *   get:
 *     tags:
 *       - Competition
 *     summary: Get competition configuration
 *     security: []
 *     responses:
 *       '200':
 *         description: Competition metadata
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompetitionConfig'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
competitionRouter.get('/', asyncHandler(async (_req, res) => {
  res.status(200).json(await tournamentService.getCompetition());
}));

/**
 * @swagger
 * /api/competition/overview:
 *   get:
 *     tags:
 *       - Competition
 *     summary: Get aggregated tournament overview
 *     security: []
 *     responses:
 *       '200':
 *         description: Competition overview payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompetitionOverview'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
competitionRouter.get('/overview', asyncHandler(async (_req, res) => {
  res.status(200).json(await tournamentService.getOverview());
}));

/**
 * @swagger
 * /api/competition/bracket:
 *   get:
 *     tags:
 *       - Competition
 *     summary: Get bracket matches
 *     security: []
 *     responses:
 *       '200':
 *         description: All matches ordered by round and date
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MatchWithRelations'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
competitionRouter.get('/bracket', asyncHandler(async (_req, res) => {
  res.status(200).json(await tournamentService.getBracket());
}));

/**
 * @swagger
 * /api/competition/rounds:
 *   get:
 *     tags:
 *       - Competition
 *     summary: Get configured rounds
 *     security: []
 *     responses:
 *       '200':
 *         description: Round definitions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RoundConfig'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
competitionRouter.get('/rounds', asyncHandler(async (_req, res) => {
  res.status(200).json(await tournamentService.getRounds());
}));

/**
 * @swagger
 * /api/competition/rounds/{roundOrderNumber}/simulate:
 *   post:
 *     tags:
 *       - Competition
 *     summary: Simulate a full round (admin only)
 *     parameters:
 *       - in: path
 *         name: roundOrderNumber
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 4
 *         description: Round order number to simulate
 *     responses:
 *       '200':
 *         description: Round simulated
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
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
competitionRouter.post('/rounds/:roundOrderNumber/simulate', authenticateToken, requireRoles(UserRole.ADMIN), asyncHandler(async (req, res) => {
  const roundOrderNumber = Number(req.params.roundOrderNumber);
  res.status(200).json(await tournamentService.simulateRound(roundOrderNumber, req.authUser!.role));
}));

/**
 * @swagger
 * /api/competition/reset-matches:
 *   post:
 *     tags:
 *       - Competition
 *     summary: Reset all matches/goals to initial state (admin only)
 *     responses:
 *       '200':
 *         description: Tournament reset completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
competitionRouter.post('/reset-matches', authenticateToken, requireRoles(UserRole.ADMIN), asyncHandler(async (req, res) => {
  res.status(200).json(await tournamentService.resetMatches(req.authUser!.role));
}));
