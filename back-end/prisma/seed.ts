import { PrismaClient, UserRole, MatchStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const teamsSeed = [
  ['Mexico', 'Mexico', 'MEX', '🇲🇽'],
  ['Austria', 'Austria', 'AUT', '🇦🇹'],
  ['Netherlands', 'Netherlands', 'NED', '🇳🇱'],
  ['Spain', 'Spain', 'ESP', '🇪🇸'],
  ['Japan', 'Japan', 'JPN', '🇯🇵'],
  ['Brazil', 'Brazil', 'BRA', '🇧🇷'],
  ['South Korea', 'South Korea', 'KOR', '🇰🇷'],
  ['Ghana', 'Ghana', 'GHA', '🇬🇭'],
  ['Serbia', 'Serbia', 'SRB', '🇷🇸'],
  ['Algeria', 'Algeria', 'ALG', '🇩🇿'],
  ['Uruguay', 'Uruguay', 'URU', '🇺🇾'],
  ['France', 'France', 'FRA', '🇫🇷'],
  ['Denmark', 'Denmark', 'DEN', '🇩🇰'],
  ['Argentina', 'Argentina', 'ARG', '🇦🇷'],
  ['Morocco', 'Morocco', 'MAR', '🇲🇦'],
  ['Belgium', 'Belgium', 'BEL', '🇧🇪']
] as const;

const firstNames = ['Nico', 'Ethan', 'Youssef', 'Leon', 'Noah', 'Luis', 'Sven', 'Mateo', 'Kenta', 'Pablo', 'Rayan', 'Luka', 'Yuki', 'Adam', 'Sam'];
const lastNames = ['Khalil', 'Santos', 'Diaz', 'Ivanov', 'Hansen', 'Mendes', 'Berg', 'Ibrahim', 'Sato', 'Ferreira', 'Haddad', 'Okafor', 'Tanaka', 'Meyer', 'Costa'];
const positions = ['GK', 'DF', 'MF', 'FW'];

async function main() {
  await prisma.goal.deleteMany();
  await prisma.match.deleteMany();
  await prisma.player.deleteMany();
  await prisma.user.deleteMany();
  await prisma.team.deleteMany();

  const adminHash = await bcrypt.hash('admin123', 10);
  const userHash = await bcrypt.hash('user123', 10);
  const refereeHash = await bcrypt.hash('referee123', 10);

  await prisma.user.create({
    data: { username: 'admin', passwordHash: adminHash, role: UserRole.ADMIN }
  });

  const teams = [] as { id: string; name: string }[];
  for (const [name, country, shortName, flag] of teamsSeed) {
    const team = await prisma.team.create({
      data: { name, country, countryShortName: shortName, countryFlag: flag }
    });
    teams.push({ id: team.id, name: team.name });
  }

  const refereeUsernames = ['Frank_De_Bleeckere', 'Ismail_Elfath', 'Michael_Oliver', 'Tori_Penso'];
  const refereeIds: string[] = [];
  for (const username of refereeUsernames) {
    const referee = await prisma.user.create({
      data: { username, passwordHash: refereeHash, role: UserRole.REFEREE }
    });
    refereeIds.push(referee.id);
  }

  await prisma.user.createMany({
    data: [
      { username: 'greetjej', passwordHash: userHash, role: UserRole.USER },
      { username: 'elkes', passwordHash: userHash, role: UserRole.USER },
      { username: 'johanp', passwordHash: userHash, role: UserRole.USER }
    ]
  });

  for (const team of teams) {
    for (let shirt = 1; shirt <= 15; shirt += 1) {
      await prisma.player.create({
        data: {
          teamId: team.id,
          firstName: firstNames[(shirt - 1) % firstNames.length],
          lastName: lastNames[(shirt - 1) % lastNames.length],
          shirtNumber: shirt,
          position: positions[(shirt - 1) % positions.length]
        }
      });
    }
  }

  const roundNames = ['8th Final', 'Quarterfinal', 'Semifinal', 'Final'];
  const baseDate = new Date('2026-06-10T16:00:00.000Z');

  const firstRoundPairs: [number, number][] = [
    [0, 1], [2, 3], [4, 5], [6, 7], [8, 9], [10, 11], [12, 13], [14, 15]
  ];

  for (let i = 0; i < firstRoundPairs.length; i += 1) {
    const [homeIndex, awayIndex] = firstRoundPairs[i];
    await prisma.match.create({
      data: {
        roundOrderNumber: 1,
        roundName: roundNames[0],
        homeTeamId: teams[homeIndex].id,
        awayTeamId: teams[awayIndex].id,
        refereeId: refereeIds[i % refereeIds.length],
        matchDate: new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000),
        status: MatchStatus.NOT_STARTED
      }
    });
  }

  for (let i = 0; i < 4; i += 1) {
    await prisma.match.create({
      data: {
        roundOrderNumber: 2,
        roundName: roundNames[1],
        refereeId: refereeIds[i % refereeIds.length],
        matchDate: new Date(baseDate.getTime() + (8 + i) * 24 * 60 * 60 * 1000),
        status: MatchStatus.PLANNED
      }
    });
  }

  for (let i = 0; i < 2; i += 1) {
    await prisma.match.create({
      data: {
        roundOrderNumber: 3,
        roundName: roundNames[2],
        refereeId: refereeIds[i % refereeIds.length],
        matchDate: new Date(baseDate.getTime() + (12 + i) * 24 * 60 * 60 * 1000),
        status: MatchStatus.PLANNED
      }
    });
  }

  await prisma.match.create({
    data: {
      roundOrderNumber: 4,
      roundName: roundNames[3],
      refereeId: refereeIds[0],
      matchDate: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000),
      status: MatchStatus.PLANNED
    }
  });

  console.log('Seed completed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
