import { UserRole } from '@prisma/client';
import { prisma } from '../repository/prisma/client';
import { AppError } from '../util/errors';

export async function listUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      role: true,
      teamId: true,
      createdAt: true
    },
    orderBy: { username: 'asc' }
  });
}

export async function deleteUser(requestedUserId: string, actorUserId: string) {
  if (requestedUserId === actorUserId) {
    throw new AppError('Admin cannot delete self', 400);
  }

  const user = await prisma.user.findUnique({ where: { id: requestedUserId } });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.role === UserRole.ADMIN) {
    throw new AppError('Cannot delete another admin', 400);
  }

  await prisma.user.delete({ where: { id: requestedUserId } });
  return { success: true };
}
