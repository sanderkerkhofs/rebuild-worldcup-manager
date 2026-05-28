import { MatchStatus } from '@prisma/client';
import { AppError } from '../util/errors';

export class MatchModel {
  static validateNonDraw(homeScore: number, awayScore: number) {
    if (homeScore === awayScore) {
      throw new AppError('Draw results are not allowed in knockout matches');
    }
  }

  static validateScore(homeScore: number, awayScore: number) {
    if (homeScore < 0 || awayScore < 0) {
      throw new AppError('Scores cannot be negative');
    }
    MatchModel.validateNonDraw(homeScore, awayScore);
  }

  static canRefereeTransition(current: MatchStatus, target: MatchStatus): boolean {
    if ((current === MatchStatus.PLANNED || current === MatchStatus.NOT_STARTED) && target === MatchStatus.IN_PROGRESS) {
      return true;
    }

    if (current === MatchStatus.IN_PROGRESS && target === MatchStatus.FINISHED) {
      return true;
    }

    return false;
  }
}
