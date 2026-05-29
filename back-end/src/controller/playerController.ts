import { PlayerStatus, UserRole } from '@prisma/client';
import { Router } from 'express';
import { authenticateToken, asyncHandler, requireRoles } from '../util/middleware';
import * as playerService from '../service/playerService';

export const playerRouter = Router();

/**
 * @swagger
 * /api/players:
 *   get:
 *     tags:
 *       - Players
 *     summary: List all players
 *     security: []
 *     responses:
 *       '200':
 *         description: Players with team information
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PlayerWithTeam'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
playerRouter.get('/', asyncHandler(async (_req, res) => {
  res.status(200).json(await playerService.listPlayers());
}));

/**
 * @swagger
 * /api/players/{playerId}:
 *   get:
 *     tags:
 *       - Players
 *     summary: Get single player
 *     security: []
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID
 *     responses:
 *       '200':
 *         description: Player details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlayerWithTeam'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
playerRouter.get('/:playerId', asyncHandler(async (req, res) => {
  res.status(200).json(await playerService.getPlayer(String(req.params.playerId)));
}));

/**
 * @swagger
 * /api/players:
 *   post:
 *     tags:
 *       - Players
 *     summary: Create player (admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpsertPlayerRequest'
 *     responses:
 *       '201':
 *         description: Player created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Player'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
playerRouter.post('/', authenticateToken, requireRoles(UserRole.ADMIN), asyncHandler(async (req, res) => {
  res.status(201).json(await playerService.createPlayer(req.body));
}));

/**
 * @swagger
 * /api/players/{playerId}:
 *   put:
 *     tags:
 *       - Players
 *     summary: Update player (admin only)
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpsertPlayerRequest'
 *     responses:
 *       '200':
 *         description: Player updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Player'
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
playerRouter.put('/:playerId', authenticateToken, requireRoles(UserRole.ADMIN), asyncHandler(async (req, res) => {
  res.status(200).json(await playerService.updatePlayer(String(req.params.playerId), req.body));
}));

/**
 * @swagger
 * /api/players/{playerId}/status:
 *   patch:
 *     tags:
 *       - Players
 *     summary: Update player status (admin only)
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePlayerStatusRequest'
 *     responses:
 *       '200':
 *         description: Player status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Player'
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
playerRouter.patch('/:playerId/status', authenticateToken, requireRoles(UserRole.ADMIN), asyncHandler(async (req, res) => {
  res.status(200).json(await playerService.updatePlayerStatus(String(req.params.playerId), req.body.status as PlayerStatus));
}));

/**
 * @swagger
 * /api/players/{playerId}:
 *   delete:
 *     tags:
 *       - Players
 *     summary: Delete player (admin only)
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID
 *     responses:
 *       '200':
 *         description: Player deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
playerRouter.delete('/:playerId', authenticateToken, requireRoles(UserRole.ADMIN), asyncHandler(async (req, res) => {
  res.status(200).json(await playerService.deletePlayer(String(req.params.playerId)));
}));
