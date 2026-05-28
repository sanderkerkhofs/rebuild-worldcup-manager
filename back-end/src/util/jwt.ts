import jwt from 'jsonwebtoken';
import { SafeUser } from '../types';
import { AppError } from './errors';

type JwtPayload = {
  sub: string;
  username: string;
  role: string;
  teamId: string | null;
};

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError('JWT_SECRET is missing', 500);
  }
  return secret;
}

export function signAuthToken(user: SafeUser): string {
  const expiresIn = (process.env.JWT_EXPIRES_IN || '1d') as jwt.SignOptions['expiresIn'];

  return jwt.sign(
    { username: user.username, role: user.role, teamId: user.teamId },
    getSecret(),
    { subject: user.id, expiresIn }
  );
}

export function verifyAuthToken(token: string): JwtPayload {
  return jwt.verify(token, getSecret()) as JwtPayload;
}
