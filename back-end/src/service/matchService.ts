import { MatchStatus, UserRole } from '@prisma/client';
import { prisma } from '../repository/prisma/client';
import { MatchModel } from '../model/match';
import { AppError } from '../util/errors';
import { replaceGoalsFromScore } from './goalSyncService';
import { canEditRound, isRoundFinished, progressRound } from './roundProgressionService';

type Actor = {
  id: string;
  role: UserRole;
};

async function assertAssignedOrAdmin(matchId: string, actor: Actor) {
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) {
    throw new AppError('Match not found', 404);
  }

  if (actor.role === UserRole.ADMIN) {
    return match;
  }

  if (actor.role !== UserRole.REFEREE || match.refereeId !== actor.id) {
    throw new AppError('Forbidden for this match', 403);
  }

  return match;
}

async function enforceRoundLock(roundOrderNumber: number) {
  const editable = await canEditRound(roundOrderNumber);
  if (!editable) {
    throw new AppError('Round is locked until previous round is complete', 400);
  }
}

export async function listMatches() {
  return prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true, referee: true },
    orderBy: [{ roundOrderNumber: 'asc' }, { matchDate: 'asc' }]
  });
}

export async function getMatch(matchId: string) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      homeTeam: true,
      awayTeam: true,
      referee: true,
      goals: { include: { player: true, team: true } }
    }
  });

  if (!match) {
    throw new AppError('Match not found', 404);
  }

  return match;
}

export async function updateMatchStatus(matchId: string, status: MatchStatus, actor: Actor) {
  const match = await assertAssignedOrAdmin(matchId, actor);
  await enforceRoundLock(match.roundOrderNumber);

  if (actor.role === UserRole.REFEREE && !MatchModel.canRefereeTransition(match.status, status)) {
    throw new AppError('Invalid status transition for referee', 400);
  }

  const updated = await prisma.match.update({
    where: { id: matchId },
    data: { status }
  });

  if (status === MatchStatus.FINISHED && (await isRoundFinished(updated.roundOrderNumber))) {
    await progressRound(updated.roundOrderNumber);
  }

  return updated;
}

export async function updateMatchResult(matchId: string, homeScore: number, awayScore: number, actor: Actor) {
  const match = await assertAssignedOrAdmin(matchId, actor);
  await enforceRoundLock(match.roundOrderNumber);

  if (match.homeTeamId == null || match.awayTeamId == null) {
    throw new AppError('Teams must be assigned before setting a result', 400);
  }

  MatchModel.validateScore(homeScore, awayScore);

  const updated = await prisma.match.update({
    where: { id: matchId },
    data: { homeScore, awayScore, status: MatchStatus.FINISHED }
  });

  await replaceGoalsFromScore(matchId, match.homeTeamId, match.awayTeamId, homeScore, awayScore);

  if (await isRoundFinished(updated.roundOrderNumber)) {
    await progressRound(updated.roundOrderNumber);
  }

  return updated;
}

export async function addGoal(matchId: string, playerId: string, teamId: string, actor: Actor) {
  const match = await assertAssignedOrAdmin(matchId, actor);
  await enforceRoundLock(match.roundOrderNumber);

  const player = await prisma.player.findUnique({ where: { id: playerId } });
  if (!player || player.teamId !== teamId) {
    throw new AppError('Player does not belong to selected team', 400);
  }

  if (player.status !== 'AVAILABLE') {
    throw new AppError('Player must be available to score', 400);
  }

  if (teamId !== match.homeTeamId && teamId !== match.awayTeamId) {
    throw new AppError('Scoring team is not in this match', 400);
  }

  const goal = await prisma.goal.create({ data: { matchId, playerId, teamId } });

  const [homeScore, awayScore] = await Promise.all([
    prisma.goal.count({ where: { matchId, teamId: match.homeTeamId || undefined } }),
    prisma.goal.count({ where: { matchId, teamId: match.awayTeamId || undefined } })
  ]);

  await prisma.match.update({ where: { id: matchId }, data: { homeScore, awayScore } });
  return goal;
}

export async function updateGoal(matchId: string, goalId: string, playerId: string, teamId: string, actor: Actor) {
  await assertAssignedOrAdmin(matchId, actor);

  const goal = await prisma.goal.findUnique({ where: { id: goalId } });
  if (!goal || goal.matchId !== matchId) {
    throw new AppError('Goal not found', 404);
  }

  const player = await prisma.player.findUnique({ where: { id: playerId } });
  if (!player || player.teamId !== teamId || player.status !== 'AVAILABLE') {
    throw new AppError('Invalid goal scorer', 400);
  }

  return prisma.goal.update({
    where: { id: goalId },
    data: { playerId, teamId }
  });
}

export async function topScorers() {
  const grouped = await prisma.goal.groupBy({ by: ['playerId'], _count: { playerId: true }, orderBy: { _count: { playerId: 'desc' } }, take: 20 });
  const playerIds = grouped.map((row) => row.playerId);

  const players = await prisma.player.findMany({ where: { id: { in: playerIds } }, include: { team: true } });

  return grouped.map((row) => {
    const player = players.find((entry) => entry.id === row.playerId);
    return {
      playerId: row.playerId,
      playerName: player ? `${player.firstName} ${player.lastName}` : 'Unknown',
      teamName: player?.team.name ?? 'Unknown',
      teamFlag: player?.team.countryFlag ?? '',
      goals: row._count.playerId
    };
  });
}
