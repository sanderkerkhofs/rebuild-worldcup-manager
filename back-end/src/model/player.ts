import { PlayerStatus } from '@prisma/client';
import { AppError } from '../util/errors';

export class PlayerModel {
  static validateNewPlayer(input: {
    firstName: string;
    lastName: string;
    shirtNumber: number;
    position: string;
    teamId: string;
  }) {
    if (!input.firstName.trim() || !input.lastName.trim()) {
      throw new AppError('Player first and last name are required');
    }

    if (!Number.isInteger(input.shirtNumber) || input.shirtNumber < 1 || input.shirtNumber > 99) {
      throw new AppError('Shirt number must be an integer between 1 and 99');
    }

    if (!input.position.trim()) {
      throw new AppError('Position is required');
    }

    if (!input.teamId.trim()) {
      throw new AppError('Team is required');
    }
  }

  static validateStatus(status: PlayerStatus) {
    if (![PlayerStatus.AVAILABLE, PlayerStatus.UNAVAILABLE].includes(status)) {
      throw new AppError('Invalid player status');
    }
  }
}
