import { MatchStatus, UserRole } from '@prisma/client';
import { prisma } from '../repository/prisma/client';
import { AppError } from '../util/errors';
import { competitionConfig, roundsConfig } from '../util/competition';
import { replaceGoalsFromScore } from './goalSyncService';
import { isRoundFinished, progressRound } from './roundProgressionService';

export async function getCompetition() {
  return competitionConfig;
}

export async function getRounds() {
  return roundsConfig;
}

export async function getBracket() {
  return prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true, referee: true },
    orderBy: [{ roundOrderNumber: 'asc' }, { matchDate: 'asc' }]
  });
}

export async function getOverview() {
  const [teams, matches, topScorers, standings] = await Promise.all([
    prisma.team.findMany({ orderBy: { name: 'asc' } }),
    prisma.match.findMany({ include: { homeTeam: true, awayTeam: true, referee: true }, orderBy: [{ roundOrderNumber: 'asc' }, { matchDate: 'asc' }] }),
    prisma.goal.groupBy({ by: ['playerId'], _count: { playerId: true }, orderBy: { _count: { playerId: 'desc' } }, take: 10 }),
    computeStandings()
  ]);

  return {
    competition: competitionConfig,
    rounds: roundsConfig,
    teams,
    matches,
    standings,
    topScorers
  };
}

async function computeStandings() {
  const finishedMatches = await prisma.match.findMany({
    where: {
      status: MatchStatus.FINISHED,
      homeTeamId: { not: null },
      awayTeamId: { not: null },
      homeScore: { not: null },
      awayScore: { not: null }
    },
    include: { homeTeam: true, awayTeam: true }
  });

  const table = new Map<string, { teamId: string; team: string; flag: string; p: number; w: number; d: number; l: number; gf: number; ga: number; gd: number; pts: number }>();

  const ensureRow = (id: string, team: string, flag: string) => {
    if (!table.has(id)) {
      table.set(id, { teamId: id, team, flag, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 });
    }
    return table.get(id)!;
  };

  for (const match of finishedMatches) {
    const home = ensureRow(match.homeTeamId!, match.homeTeam!.name, match.homeTeam!.countryFlag);
    const away = ensureRow(match.awayTeamId!, match.awayTeam!.name, match.awayTeam!.countryFlag);
    const hs = match.homeScore!;
    const as = match.awayScore!;

    home.p += 1;
    away.p += 1;
    home.gf += hs;
    home.ga += as;
    away.gf += as;
    away.ga += hs;

    if (hs > as) {
      home.w += 1;
      home.pts += 3;
      away.l += 1;
    } else if (as > hs) {
      away.w += 1;
      away.pts += 3;
      home.l += 1;
    }
  }

  const rows = Array.from(table.values());
  for (const row of rows) {
    row.gd = row.gf - row.ga;
  }

  return rows.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return b.gf - a.gf;
  });
}

export async function simulateRound(roundOrderNumber: number, actorRole: UserRole) {
  if (actorRole !== UserRole.ADMIN) {
    throw new AppError('Forbidden', 403);
  }

  if (roundOrderNumber < 1 || roundOrderNumber > 4) {
    throw new AppError('Round must be between 1 and 4', 400);
  }

  if (roundOrderNumber > 1 && !(await isRoundFinished(roundOrderNumber - 1))) {
    throw new AppError('Previous round must be complete before simulation', 400);
  }

  const matches = await prisma.match.findMany({ where: { roundOrderNumber } });
  for (const match of matches) {
    if (!match.homeTeamId || !match.awayTeamId) {
      throw new AppError('Round cannot be simulated because teams are not assigned', 400);
    }

    const homeScore = Math.floor(Math.random() * 5);
    let awayScore = Math.floor(Math.random() * 5);
    if (homeScore === awayScore) {
      awayScore = (awayScore + 1) % 5;
    }

    await prisma.match.update({
      where: { id: match.id },
      data: {
        status: MatchStatus.FINISHED,
        homeScore,
        awayScore
      }
    });

    await replaceGoalsFromScore(match.id, match.homeTeamId, match.awayTeamId, homeScore, awayScore);
  }

  await progressRound(roundOrderNumber);
  return { success: true };
}

export async function resetMatches(actorRole: UserRole) {
  if (actorRole !== UserRole.ADMIN) {
    throw new AppError('Forbidden', 403);
  }

  await prisma.goal.deleteMany();

  const firstRound = await prisma.match.findMany({ where: { roundOrderNumber: 1 }, orderBy: { matchDate: 'asc' } });
  for (const match of firstRound) {
    await prisma.match.update({
      where: { id: match.id },
      data: {
        status: MatchStatus.NOT_STARTED,
        homeScore: null,
        awayScore: null
      }
    });
  }

  const nextRounds = await prisma.match.findMany({ where: { roundOrderNumber: { gt: 1 } } });
  for (const match of nextRounds) {
    await prisma.match.update({
      where: { id: match.id },
      data: {
        homeTeamId: null,
        awayTeamId: null,
        homeScore: null,
        awayScore: null,
        status: MatchStatus.PLANNED
      }
    });
  }

  return { success: true };
}
