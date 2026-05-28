import { MatchStatus } from '@prisma/client';
import { prisma } from '../repository/prisma/client';
import { MatchModel } from '../model/match';
import { AppError } from '../util/errors';

function winnerTeamId(match: { homeTeamId: string | null; awayTeamId: string | null; homeScore: number | null; awayScore: number | null }): string {
  if (!match.homeTeamId || !match.awayTeamId || match.homeScore == null || match.awayScore == null) {
    throw new AppError('Match winner cannot be resolved');
  }

  MatchModel.validateNonDraw(match.homeScore, match.awayScore);
  return match.homeScore > match.awayScore ? match.homeTeamId : match.awayTeamId;
}

export async function isRoundFinished(roundOrderNumber: number): Promise<boolean> {
  const matches = await prisma.match.findMany({ where: { roundOrderNumber } });
  if (!matches.length) {
    return false;
  }

  return matches.every((match) => {
    if (match.status !== MatchStatus.FINISHED) {
      return false;
    }
    if (match.homeScore == null || match.awayScore == null) {
      return false;
    }

    return match.homeScore !== match.awayScore;
  });
}

export async function canEditRound(roundOrderNumber: number): Promise<boolean> {
  if (roundOrderNumber === 1) {
    return true;
  }

  return isRoundFinished(roundOrderNumber - 1);
}

export async function progressRound(roundOrderNumber: number): Promise<void> {
  if (roundOrderNumber >= 4) {
    return;
  }

  const currentMatches = await prisma.match.findMany({
    where: { roundOrderNumber },
    orderBy: { matchDate: 'asc' }
  });

  if (!currentMatches.length) {
    throw new AppError('Round has no matches');
  }

  const winners = currentMatches.map(winnerTeamId);
  if (winners.length % 2 !== 0) {
    throw new AppError('Invalid winner count for progression');
  }

  const nextMatches = await prisma.match.findMany({
    where: { roundOrderNumber: roundOrderNumber + 1 },
    orderBy: { matchDate: 'asc' }
  });

  const expectedNextMatches = winners.length / 2;
  if (nextMatches.length !== expectedNextMatches) {
    throw new AppError('Next round match count mismatch');
  }

  for (let i = 0; i < nextMatches.length; i += 1) {
    const homeTeamId = winners[i * 2];
    const awayTeamId = winners[i * 2 + 1];

    await prisma.match.update({
      where: { id: nextMatches[i].id },
      data: {
        homeTeamId,
        awayTeamId,
        homeScore: null,
        awayScore: null,
        status: MatchStatus.NOT_STARTED
      }
    });
  }
}
