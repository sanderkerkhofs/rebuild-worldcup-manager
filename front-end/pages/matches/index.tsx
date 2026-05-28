import Link from 'next/link';
import useSWR from 'swr';
import { useSession } from '../../lib/useSession';
import { getMatches } from '../../services/competitionService';

export default function MatchesPage() {
  const { isAuthenticated } = useSession();
  const { data, error, isLoading } = useSWR(isAuthenticated ? '/matches' : null, getMatches);

  if (!isAuthenticated) {
    return <section className="panel">Please login to view matches.</section>;
  }

  if (isLoading) return <section className="panel">Loading matches...</section>;
  if (error || !data) return <section className="panel error">Failed to load matches.</section>;

  const rounds = [1, 2, 3, 4];

  return (
    <>
      {rounds.map((round) => (
        <section className="panel" key={round}>
          <h2>Round {round}</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Fixture</th>
                <th>Date</th>
                <th>Referee</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.filter((match) => match.roundOrderNumber === round).map((match) => (
                <tr key={match.id}>
                  <td><Link href={`/matches/${match.id}`}>{match.homeTeam?.countryFlag} {match.homeTeam?.name || 'TBD'} vs {match.awayTeam?.countryFlag} {match.awayTeam?.name || 'TBD'}</Link></td>
                  <td>{new Date(match.matchDate).toLocaleString()}</td>
                  <td>{match.referee?.username || '-'}</td>
                  <td>{match.homeScore ?? '-'} : {match.awayScore ?? '-'}</td>
                  <td>{match.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </>
  );
}
