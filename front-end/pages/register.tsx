import { useRouter } from 'next/router';
import LoginForm from '../components/LoginForm';
import { useI18n } from '../lib/i18n';
import { useSession } from '../lib/useSession';
import { register } from '../services/authService';

export default function RegisterPage() {
  const router = useRouter();
  const { signIn } = useSession();
  const { t } = useI18n();

  async function handleRegister(username: string, password: string) {
    const auth = await register(username, password);
    signIn(auth.token, auth.user);
    await router.push('/');
  }

  return (
    <section className="panel">
      <h2>{t('createAccount')}</h2>
      <p>Register to create a USER account that can view protected pages.</p>
      <LoginForm onSubmit={handleRegister} buttonLabel={t('register')} />
    </section>
  );
}
