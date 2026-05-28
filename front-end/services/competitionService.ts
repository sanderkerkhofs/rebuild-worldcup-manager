import { apiRequest } from '../lib/api';
import { Match } from '../types';

export function getOverview() {
  return apiRequest<{
    competition: { name: string; year: number; hostCountry: string };
    rounds: { roundOrderNumber: number; roundName: string; matches: number }[];
    matches: Match[];
    standings: { team: string; flag: string; p: number; w: number; d: number; l: number; pts: number; gd: number; gf: number; ga: number }[];
    topScorers: { playerId: string; _count: { playerId: number } }[];
  }>('/competition/overview');
}

export function getMatches() {
  return apiRequest<Match[]>('/matches');
}

export function getMatch(matchId: string) {
  return apiRequest<Match & { goals: { id: string; player: { firstName: string; lastName: string } }[] }>(`/matches/${matchId}`);
}

export function getTopScorers() {
  return apiRequest<{ playerName: string; teamName: string; teamFlag: string; goals: number }[]>('/matches/top-scorers');
}

export function getUsers() {
  return apiRequest<{ id: string; username: string; role: string }[]>('/users');
}

export function simulateRound(roundOrderNumber: number) {
  return apiRequest<{ success: boolean }>(`/competition/rounds/${roundOrderNumber}/simulate`, { method: 'POST' });
}

export function resetMatches() {
  return apiRequest<{ success: boolean }>('/competition/reset-matches', { method: 'POST' });
}

export function updateMatchResult(matchId: string, homeScore: number, awayScore: number) {
  return apiRequest(`/matches/${matchId}/result`, { method: 'PUT', body: JSON.stringify({ homeScore, awayScore }) });
}

export function updateMatchStatus(matchId: string, status: string) {
  return apiRequest(`/matches/${matchId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

export function addGoal(matchId: string, playerId: string, teamId: string) {
  return apiRequest(`/matches/${matchId}/goals`, { method: 'POST', body: JSON.stringify({ playerId, teamId }) });
}
