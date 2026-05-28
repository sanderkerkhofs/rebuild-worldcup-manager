import { UserRole } from '@prisma/client';
import { AppError } from '../util/errors';
import * as tournamentService from '../service/tournamentService';

describe('service role guards', () => {
  test('blocks non-admin simulation', async () => {
    await expect(tournamentService.simulateRound(1, UserRole.USER)).rejects.toBeInstanceOf(AppError);
  });

  test('blocks non-admin reset', async () => {
    await expect(tournamentService.resetMatches(UserRole.REFEREE)).rejects.toBeInstanceOf(AppError);
  });
});
