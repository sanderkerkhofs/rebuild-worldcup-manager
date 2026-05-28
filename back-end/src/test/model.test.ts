import { MatchStatus } from '@prisma/client';
import { MatchModel } from '../model/match';
import { PlayerModel } from '../model/player';

describe('domain model validation', () => {
  test('rejects knockout draw', () => {
    expect(() => MatchModel.validateScore(1, 1)).toThrow('Draw results are not allowed');
  });

  test('rejects invalid shirt number', () => {
    expect(() => {
      PlayerModel.validateNewPlayer({
        firstName: 'A',
        lastName: 'B',
        shirtNumber: 0,
        position: 'FW',
        teamId: 'team-1'
      });
    }).toThrow('Shirt number');
  });

  test('allows referee status flow planned to in progress', () => {
    expect(MatchModel.canRefereeTransition(MatchStatus.PLANNED, MatchStatus.IN_PROGRESS)).toBe(true);
  });
});
