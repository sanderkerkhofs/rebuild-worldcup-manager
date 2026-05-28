import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { useI18n } from '../lib/i18n';
import { useSession } from '../lib/useSession';

export default function Layout({ children }: PropsWithChildren) {
  const { user, isAuthenticated, signOut } = useSession();
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="page-shell">
      <header className="header">
        <h1>Worldcup Manager 2026</h1>
        <nav className="nav">
          <Link href="/">{t('home')}</Link>
          {!isAuthenticated ? <Link href="/login">{t('login')}</Link> : null}
          {!isAuthenticated ? <Link href="/register">{t('register')}</Link> : null}
          {isAuthenticated ? <Link href="/matches">{t('matches')}</Link> : null}
          {isAuthenticated ? <Link href="/stats">{t('stats')}</Link> : null}
          {user?.role === 'ADMIN' ? <Link href="/admin">{t('admin')}</Link> : null}
          {user?.role === 'REFEREE' ? <Link href="/referee">{t('referee')}</Link> : null}
        </nav>
        <div className="toolbar">
          {isAuthenticated ? (
            <>
              <span>{user?.username} ({user?.role})</span>
              <button onClick={signOut}>Logout</button>
            </>
          ) : null}
          <div className="locale-switch">
            {(['nl', 'en', 'fr'] as const).map((code) => (
              <button key={code} className={locale === code ? 'active' : ''} onClick={() => setLocale(code)}>
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
