import { useRouter } from 'next/router';
import LoginForm from '../components/LoginForm';
import { useI18n } from '../lib/i18n';
import { useSession } from '../lib/useSession';
import { login } from '../services/authService';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useSession();
  const { t } = useI18n();

  async function handleLogin(username: string, password: string) {
    const auth = await login(username, password);
    signIn(auth.token, auth.user);
    await router.push('/');
  }

  return (
    <>
      <section className="panel">
        <h2>{t('predefinedAccess')}</h2>
        <p>Use these credentials for role-based testing.</p>
        <table className="table">
          <thead>
            <tr><th>Username</th><th>Password</th><th>Role</th></tr>
          </thead>
          <tbody>
            <tr><td>admin</td><td>admin123</td><td>ADMIN</td></tr>
            <tr><td>greetjej</td><td>user123</td><td>USER</td></tr>
            <tr><td>elkes</td><td>user123</td><td>USER</td></tr>
            <tr><td>johanp</td><td>user123</td><td>USER</td></tr>
            <tr><td>Frank_De_Bleeckere</td><td>referee123</td><td>REFEREE</td></tr>
          </tbody>
        </table>
      </section>
      <section className="panel">
        <h2>{t('signIn')}</h2>
        <LoginForm onSubmit={handleLogin} buttonLabel={t('login')} />
      </section>
    </>
  );
}
