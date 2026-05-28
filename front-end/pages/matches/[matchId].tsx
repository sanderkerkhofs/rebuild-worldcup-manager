import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import useSWR from 'swr';
import { useSession } from '../../lib/useSession';
import { addGoal, getMatch, updateMatchResult, updateMatchStatus } from '../../services/competitionService';

export default function MatchDetailPage() {
  const router = useRouter();
  const { matchId } = router.query;
  const { user, isAuthenticated } = useSession();
  const { data, error, mutate } = useSWR(matchId ? `/matches/${matchId}` : null, () => getMatch(String(matchId)));

  const [status, setStatus] = useState('NOT_STARTED');
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [goalPlayerId, setGoalPlayerId] = useState('');
  const [goalTeamId, setGoalTeamId] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return <section className="panel">Restricted access. Please login.</section>;
  }

  if (!data) {
    if (error) return <section className="panel error">Failed to load match.</section>;
    return <section className="panel">Loading match...</section>;
  }

  const canEdit = user?.role === 'ADMIN' || user?.role === 'REFEREE';

  async function onStatusSubmit(event: FormEvent) {
    event.preventDefault();
    setActionError(null);
    if (!data) return;
    try {
      await updateMatchStatus(data.id, status);
      await mutate();
    } catch (requestError) {
      setActionError(requestError instanceof Error ? requestError.message : 'Update failed');
    }
  }

  async function onResultSubmit(event: FormEvent) {
    event.preventDefault();
    setActionError(null);
    if (!data) return;
    try {
      await updateMatchResult(data.id, Number(homeScore), Number(awayScore));
      await mutate();
    } catch (requestError) {
      setActionError(requestError instanceof Error ? requestError.message : 'Update failed');
    }
  }

  async function onGoalSubmit(event: FormEvent) {
    event.preventDefault();
    setActionError(null);
    if (!data) return;
    try {
      await addGoal(data.id, goalPlayerId, goalTeamId);
      await mutate();
    } catch (requestError) {
      setActionError(requestError instanceof Error ? requestError.message : 'Update failed');
    }
  }

  return (
    <>
      <section className="panel">
        <h2>{data.homeTeam?.countryFlag} {data.homeTeam?.name || 'TBD'} vs {data.awayTeam?.countryFlag} {data.awayTeam?.name || 'TBD'}</h2>
        <p>Round: {data.roundName}</p>
        <p>Date: {new Date(data.matchDate).toLocaleString()}</p>
        <p>Status: {data.status}</p>
        <p>Score: {data.homeScore ?? '-'} : {data.awayScore ?? '-'}</p>
      </section>

      {canEdit ? (
        <section className="panel">
          <h3>Edit match status</h3>
          <form onSubmit={onStatusSubmit} className="inline-form">
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="PLANNED">PLANNED</option>
              <option value="NOT_STARTED">NOT_STARTED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="FINISHED">FINISHED</option>
            </select>
            <button type="submit">Save status</button>
          </form>

          <h3>Update result</h3>
          <form onSubmit={onResultSubmit} className="inline-form">
            <input type="number" min={0} value={homeScore} onChange={(event) => setHomeScore(event.target.value)} placeholder="Home score" required />
            <input type="number" min={0} value={awayScore} onChange={(event) => setAwayScore(event.target.value)} placeholder="Away score" required />
            <button type="submit">Save result</button>
          </form>

          <h3>Record goal scorer</h3>
          <form onSubmit={onGoalSubmit} className="inline-form">
            <input value={goalPlayerId} onChange={(event) => setGoalPlayerId(event.target.value)} placeholder="Player ID" required />
            <input value={goalTeamId} onChange={(event) => setGoalTeamId(event.target.value)} placeholder="Team ID" required />
            <button type="submit">Save goal</button>
          </form>

          {actionError ? <p className="error">{actionError}</p> : null}

          <h3>Goals</h3>
          <ul>
            {data.goals.map((goal) => (
              <li key={goal.id}>{goal.player.firstName} {goal.player.lastName}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
