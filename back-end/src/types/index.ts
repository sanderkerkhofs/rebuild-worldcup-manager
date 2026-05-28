import { MatchStatus, PlayerStatus, UserRole } from '@prisma/client';

export type SafeUser = {
  id: string;
  username: string;
  role: UserRole;
  teamId: string | null;
};

export type AuthResponse = {
  token: string;
  user: SafeUser;
};

export type ApiErrorShape = {
  message: string;
  statusCode: number;
};

export type MatchResultInput = {
  homeScore: number;
  awayScore: number;
};

export type GoalInput = {
  playerId: string;
  teamId: string;
};

export type UpdateStatusInput = {
  status: MatchStatus;
};

export type UpdatePlayerInput = {
  firstName: string;
  lastName: string;
  shirtNumber: number;
  position: string;
  status: PlayerStatus;
  teamId: string;
};
