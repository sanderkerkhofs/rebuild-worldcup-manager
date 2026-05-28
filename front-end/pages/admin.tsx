import { useState } from 'react';
import useSWR from 'swr';
import { useSession } from '../lib/useSession';
import { getMatches, getUsers, resetMatches, simulateRound } from '../services/competitionService';

export default function AdminPage() {
  const { user } = useSession();
  const [message, setMessage] = useState('');
  const { data: users, mutate: mutateUsers } = useSWR(user?.role === 'ADMIN' ? '/users' : null, getUsers);
  const { data: matches, mutate: mutateMatches } = useSWR(user?.role === 'ADMIN' ? '/matches' : null, getMatches);

  if (user?.role !== 'ADMIN') {
    return <section className="panel">Access denied. Admin role required.</section>;
  }

  async function onSimulate(roundOrderNumber: number) {
    try {
      await simulateRound(roundOrderNumber);
      await mutateMatches();
      setMessage(`Round ${roundOrderNumber} simulated.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Simulation failed');
    }
  }

  async function onReset() {
    try {
      await resetMatches();
      await mutateMatches();
      await mutateUsers();
      setMessage('Tournament reset complete.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Reset failed');
    }
  }

  return (
    <>
      <section className="panel">
        <h2>Tournament Management</h2>
        <div className="actions">
          <button onClick={onReset}>Reset all match scores and goals</button>
          <button onClick={() => onSimulate(1)}>Simulate round 1</button>
          <button onClick={() => onSimulate(2)}>Simulate round 2</button>
          <button onClick={() => onSimulate(3)}>Simulate round 3</button>
          <button onClick={() => onSimulate(4)}>Simulate round 4</button>
        </div>
        {message ? <p>{message}</p> : null}
      </section>

      <section className="panel">
        <h2>Round Management</h2>
        <table className="table">
          <thead><tr><th>Round</th><th>Matches</th><th>Finished</th><th>Current Round</th></tr></thead>
          <tbody>
            {[1, 2, 3, 4].map((round) => {
              const list = (matches || []).filter((match) => match.roundOrderNumber === round);
              const finished = list.filter((match) => match.status === 'FINISHED').length;
              return (
                <tr key={round}>
                  <td>{round}</td>
                  <td>{list.length}</td>
                  <td>{finished}/{list.length}</td>
                  <td>{list.some((match) => match.status !== 'FINISHED') ? 'Yes' : 'No'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="panel">
        <h2>User Management</h2>
        <table className="table">
          <thead><tr><th>Username</th><th>Role</th></tr></thead>
          <tbody>
            {(users || []).map((entry) => (
              <tr key={entry.id}><td>{entry.username}</td><td>{entry.role}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
