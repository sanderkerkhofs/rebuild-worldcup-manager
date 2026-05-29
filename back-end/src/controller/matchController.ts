import { MatchStatus, UserRole } from '@prisma/client';
import { Router } from 'express';
import { authenticateToken, asyncHandler, requireRoles } from '../util/middleware';
import * as matchService from '../service/matchService';

export const matchRouter = Router();

/**
 * @swagger
 * /api/matches:
 *   get:
 *     tags:
 *       - Matches
 *     summary: List all matches
 *     security: []
 *     responses:
 *       '200':
 *         description: Matches with related teams and referee
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MatchWithRelations'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
matchRouter.get('/', asyncHandler(async (_req, res) => {
  res.status(200).json(await matchService.listMatches());
}));

/**
 * @swagger
 * /api/matches/top-scorers:
 *   get:
 *     tags:
 *       - Matches
 *     summary: Get top scorers leaderboard
 *     security: []
 *     responses:
 *       '200':
 *         description: Top scorers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TopScorer'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
matchRouter.get('/top-scorers', asyncHandler(async (_req, res) => {
  res.status(200).json(await matchService.topScorers());
}));

/**
 * @swagger
 * /api/matches/{matchId}:
 *   get:
 *     tags:
 *       - Matches
 *     summary: Get single match with goals
 *     security: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *         description: Match ID
 *     responses:
 *       '200':
 *         description: Match detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MatchDetail'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
matchRouter.get('/:matchId', asyncHandler(async (req, res) => {
  res.status(200).json(await matchService.getMatch(String(req.params.matchId)));
}));

/**
 * @swagger
 * /api/matches/{matchId}/status:
 *   patch:
 *     tags:
 *       - Matches
 *     summary: Update match status (admin/referee)
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *         description: Match ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMatchStatusRequest'
 *     responses:
 *       '200':
 *         description: Match status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
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
matchRouter.patch('/:matchId/status', authenticateToken, requireRoles(UserRole.ADMIN, UserRole.REFEREE), asyncHandler(async (req, res) => {
  const actor = { id: req.authUser!.id, role: req.authUser!.role };
  const status = req.body.status as MatchStatus;
  res.status(200).json(await matchService.updateMatchStatus(String(req.params.matchId), status, actor));
}));

/**
 * @swagger
 * /api/matches/{matchId}/result:
 *   put:
 *     tags:
 *       - Matches
 *     summary: Set match result (admin/referee)
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *         description: Match ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMatchResultRequest'
 *     responses:
 *       '200':
 *         description: Result applied and match finished
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
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
matchRouter.put('/:matchId/result', authenticateToken, requireRoles(UserRole.ADMIN, UserRole.REFEREE), asyncHandler(async (req, res) => {
  const actor = { id: req.authUser!.id, role: req.authUser!.role };
  res.status(200).json(await matchService.updateMatchResult(String(req.params.matchId), Number(req.body.homeScore), Number(req.body.awayScore), actor));
}));

/**
 * @swagger
 * /api/matches/{matchId}/goals:
 *   post:
 *     tags:
 *       - Matches
 *     summary: Add goal event (admin/referee)
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *         description: Match ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoalRequest'
 *     responses:
 *       '201':
 *         description: Goal added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Goal'
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
matchRouter.post('/:matchId/goals', authenticateToken, requireRoles(UserRole.ADMIN, UserRole.REFEREE), asyncHandler(async (req, res) => {
  const actor = { id: req.authUser!.id, role: req.authUser!.role };
  res.status(201).json(await matchService.addGoal(String(req.params.matchId), req.body.playerId, req.body.teamId, actor));
}));

/**
 * @swagger
 * /api/matches/{matchId}/goals/{goalId}:
 *   patch:
 *     tags:
 *       - Matches
 *     summary: Update goal event (admin/referee)
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *         description: Match ID
 *       - in: path
 *         name: goalId
 *         required: true
 *         schema:
 *           type: string
 *         description: Goal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoalRequest'
 *     responses:
 *       '200':
 *         description: Goal updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Goal'
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
matchRouter.patch('/:matchId/goals/:goalId', authenticateToken, requireRoles(UserRole.ADMIN, UserRole.REFEREE), asyncHandler(async (req, res) => {
  const actor = { id: req.authUser!.id, role: req.authUser!.role };
  res.status(200).json(await matchService.updateGoal(String(req.params.matchId), String(req.params.goalId), req.body.playerId, req.body.teamId, actor));
}));
