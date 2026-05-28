import Link from 'next/link';
import useSWR from 'swr';
import DashboardPanels from '../components/DashboardPanels';
import { useI18n } from '../lib/i18n';
import { getOverview } from '../services/competitionService';

export default function HomePage() {
  const { t } = useI18n();
  const { data, error, isLoading } = useSWR('/overview', getOverview);

  if (isLoading) return <section className="panel">Loading...</section>;
  if (error || !data) return <section className="panel error">Failed to load overview.</section>;

  const currentRound = data.matches.find((match) => match.roundOrderNumber === 2)?.roundName || '8th Final';

  return (
    <>
      <section className="panel">
        <p className="section-kicker">{t('currentRound')}</p>
        <h2>{currentRound}</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Fixture</th>
              <th>Score</th>
              <th>Date</th>
              <th>Status</th>
              <th>Referee</th>
            </tr>
          </thead>
          <tbody>
            {data.matches.filter((match) => match.roundOrderNumber === 2).map((match) => (
              <tr key={match.id}>
                <td>{match.homeTeam?.countryFlag} {match.homeTeam?.name} vs {match.awayTeam?.countryFlag} {match.awayTeam?.name}</td>
                <td>{match.homeScore ?? '-'} : {match.awayScore ?? '-'}</td>
                <td>{new Date(match.matchDate).toLocaleString()}</td>
                <td>{match.status}</td>
                <td>{match.referee?.username || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <DashboardPanels
        left={{
          title: 'Top 5 Standings',
          rows: data.standings.slice(0, 5).map((row) => `${row.flag} ${row.team} - ${row.pts} pts`)
        }}
        right={{
          title: 'Top 5 Goalscorers',
          rows: data.topScorers.slice(0, 5).map((row) => `${row.playerId} - ${row._count.playerId} goals`)
        }}
      />

      <section className="panel">
        <h3>{t('restricted')}</h3>
        <p>Login as a user to view all pages and editing tools.</p>
        <div className="actions">
          <Link href="/login" className="button-link">{t('goToLogin')}</Link>
          <Link href="/register" className="button-link">{t('goToRegister')}</Link>
        </div>
      </section>
    </>
  );
}
