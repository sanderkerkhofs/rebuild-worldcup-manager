import useSWR from 'swr';
import { useSession } from '../lib/useSession';
import { getMatches } from '../services/competitionService';

export default function RefereePage() {
  const { user } = useSession();
  const { data } = useSWR(user?.role === 'REFEREE' ? '/matches' : null, getMatches);

  if (user?.role !== 'REFEREE') {
    return <section className="panel">Access denied. Referee role required.</section>;
  }

  const assigned = (data || []).filter((match) => match.referee?.username === user.username);

  return (
    <section className="panel">
      <h2>Assigned Matches</h2>
      <table className="table">
        <thead>
          <tr><th>Fixture</th><th>Date</th><th>Status</th></tr>
        </thead>
        <tbody>
          {assigned.map((match) => (
            <tr key={match.id}>
              <td>{match.homeTeam?.countryFlag} {match.homeTeam?.name || 'TBD'} vs {match.awayTeam?.countryFlag} {match.awayTeam?.name || 'TBD'}</td>
              <td>{new Date(match.matchDate).toLocaleString()}</td>
              <td>{match.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
