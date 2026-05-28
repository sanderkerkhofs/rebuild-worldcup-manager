export type UserRole = 'ADMIN' | 'REFEREE' | 'USER';

export type SafeUser = {
  id: string;
  username: string;
  role: UserRole;
  teamId: string | null;
};

export type SessionState = {
  token: string | null;
  user: SafeUser | null;
  isAuthenticated: boolean;
};

export type Team = {
  id: string;
  name: string;
  countryFlag: string;
};

export type Match = {
  id: string;
  roundOrderNumber: number;
  roundName: string;
  homeTeamId: string | null;
  awayTeamId: string | null;
  homeTeam?: Team | null;
  awayTeam?: Team | null;
  homeScore: number | null;
  awayScore: number | null;
  matchDate: string;
  status: 'PLANNED' | 'NOT_STARTED' | 'IN_PROGRESS' | 'FINISHED';
  referee?: { username: string } | null;
};
