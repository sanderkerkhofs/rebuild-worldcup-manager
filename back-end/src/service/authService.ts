import { UserRole } from '@prisma/client';
import { prisma } from '../repository/prisma/client';
import { AuthResponse, SafeUser } from '../types';
import { AppError } from '../util/errors';
import { signAuthToken } from '../util/jwt';
import { comparePassword, hashPassword } from '../util/password';

function toSafeUser(user: { id: string; username: string; role: UserRole; teamId: string | null }): SafeUser {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    teamId: user.teamId
  };
}

export async function register(username: string, password: string): Promise<AuthResponse> {
  if (!username.trim() || !password.trim()) {
    throw new AppError('Username and password are required');
  }

  const existingUser = await prisma.user.findFirst({
    where: { username: { equals: username, mode: 'insensitive' } }
  });

  if (existingUser) {
    throw new AppError('Username already exists', 409);
  }

  const passwordHash = await hashPassword(password);

  const createdUser = await prisma.user.create({
    data: { username, passwordHash, role: UserRole.USER }
  });

  const safeUser = toSafeUser(createdUser);
  return { token: signAuthToken(safeUser), user: safeUser };
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const user = await prisma.user.findFirst({
    where: { username: { equals: username, mode: 'insensitive' } }
  });

  if (!user || !(await comparePassword(password, user.passwordHash))) {
    throw new AppError('Invalid username or password', 401);
  }

  const safeUser = toSafeUser(user);
  return { token: signAuthToken(safeUser), user: safeUser };
}

export async function me(userId: string): Promise<SafeUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  return toSafeUser(user);
}
