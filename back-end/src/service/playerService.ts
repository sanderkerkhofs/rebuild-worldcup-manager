import { PlayerStatus } from '@prisma/client';
import { prisma } from '../repository/prisma/client';
import { PlayerModel } from '../model/player';
import { AppError } from '../util/errors';

export async function listPlayers() {
  return prisma.player.findMany({ include: { team: true }, orderBy: [{ team: { name: 'asc' } }, { shirtNumber: 'asc' }] });
}

export async function getPlayer(playerId: string) {
  const player = await prisma.player.findUnique({ where: { id: playerId }, include: { team: true } });
  if (!player) {
    throw new AppError('Player not found', 404);
  }
  return player;
}

export async function createPlayer(input: {
  firstName: string;
  lastName: string;
  shirtNumber: number;
  position: string;
  teamId: string;
}) {
  PlayerModel.validateNewPlayer(input);

  return prisma.player.create({
    data: {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      shirtNumber: input.shirtNumber,
      position: input.position.trim(),
      teamId: input.teamId,
      status: PlayerStatus.AVAILABLE
    }
  });
}

export async function updatePlayer(playerId: string, input: {
  firstName: string;
  lastName: string;
  shirtNumber: number;
  position: string;
  teamId: string;
  status: PlayerStatus;
}) {
  await getPlayer(playerId);
  PlayerModel.validateNewPlayer(input);
  PlayerModel.validateStatus(input.status);

  return prisma.player.update({
    where: { id: playerId },
    data: {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      shirtNumber: input.shirtNumber,
      position: input.position.trim(),
      teamId: input.teamId,
      status: input.status
    }
  });
}

export async function updatePlayerStatus(playerId: string, status: PlayerStatus) {
  await getPlayer(playerId);
  PlayerModel.validateStatus(status);
  return prisma.player.update({ where: { id: playerId }, data: { status } });
}

export async function deletePlayer(playerId: string) {
  await getPlayer(playerId);
  await prisma.player.delete({ where: { id: playerId } });
  return { success: true };
}
