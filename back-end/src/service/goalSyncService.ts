import { PlayerStatus } from '@prisma/client';
import { prisma } from '../repository/prisma/client';
import { AppError } from '../util/errors';

function pickRandomPlayerId(playerIds: string[]) {
  return playerIds[Math.floor(Math.random() * playerIds.length)];
}

async function teamPlayerIds(teamId: string) {
  const available = await prisma.player.findMany({
    where: { teamId, status: PlayerStatus.AVAILABLE },
    select: { id: true }
  });

  if (available.length > 0) {
    return available.map((player) => player.id);
  }

  const fallback = await prisma.player.findMany({
    where: { teamId },
    select: { id: true }
  });

  return fallback.map((player) => player.id);
}

export async function replaceGoalsFromScore(matchId: string, homeTeamId: string, awayTeamId: string, homeScore: number, awayScore: number) {
  const [homePlayerIds, awayPlayerIds] = await Promise.all([
    teamPlayerIds(homeTeamId),
    teamPlayerIds(awayTeamId)
  ]);

  if (homePlayerIds.length === 0 || awayPlayerIds.length === 0) {
    throw new AppError('Cannot create goal events because one or more teams have no players', 400);
  }

  const goals = [
    ...Array.from({ length: homeScore }, () => ({
      matchId,
      teamId: homeTeamId,
      playerId: pickRandomPlayerId(homePlayerIds)
    })),
    ...Array.from({ length: awayScore }, () => ({
      matchId,
      teamId: awayTeamId,
      playerId: pickRandomPlayerId(awayPlayerIds)
    }))
  ];

  await prisma.goal.deleteMany({ where: { matchId } });

  if (goals.length > 0) {
    await prisma.goal.createMany({ data: goals });
  }
}
