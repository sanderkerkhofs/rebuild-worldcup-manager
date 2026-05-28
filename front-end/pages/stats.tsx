import useSWR from 'swr';
import { useSession } from '../lib/useSession';
import { getOverview, getTopScorers } from '../services/competitionService';

export default function StatsPage() {
  const { isAuthenticated } = useSession();
  const { data: overview, isLoading: loadingOverview } = useSWR(isAuthenticated ? '/overview' : null, getOverview);
  const { data: scorers, isLoading: loadingScorers } = useSWR(isAuthenticated ? '/scorers' : null, getTopScorers);

  if (!isAuthenticated) {
    return <section className="panel">Please login to view stats.</section>;
  }

  if (loadingOverview || loadingScorers || !overview || !scorers) {
    return <section className="panel">Loading stats...</section>;
  }

  return (
    <>
      <section className="panel">
        <h2>Tournament Standings</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>PTS</th>
            </tr>
          </thead>
          <tbody>
            {overview.standings.map((row) => (
              <tr key={row.team}>
                <td>{row.flag} {row.team}</td>
                <td>{row.p}</td><td>{row.w}</td><td>{row.d}</td><td>{row.l}</td><td>{row.gf}</td><td>{row.ga}</td><td>{row.gd}</td><td>{row.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel">
        <h2>Goalscoring Leaderboard</h2>
        <table className="table">
          <thead><tr><th>Player</th><th>Team</th><th>Goals</th></tr></thead>
          <tbody>
            {scorers.map((row) => (
              <tr key={`${row.playerName}-${row.teamName}`}>
                <td>{row.playerName}</td>
                <td>{row.teamFlag} {row.teamName}</td>
                <td>{row.goals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
