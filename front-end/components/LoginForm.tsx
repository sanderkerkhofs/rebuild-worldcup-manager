import { FormEvent, useState } from 'react';

type LoginFormProps = {
  onSubmit: (username: string, password: string) => Promise<void>;
  buttonLabel: string;
};

export default function LoginForm({ onSubmit, buttonLabel }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    try {
      await onSubmit(username, password);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Request failed');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel form-panel">
      <label>Username</label>
      <input value={username} onChange={(event) => setUsername(event.target.value)} required />
      <label>Password</label>
      <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      {error ? <p className="error">{error}</p> : null}
      <button type="submit">{buttonLabel}</button>
    </form>
  );
}
