import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { I18nProvider } from '../lib/i18n';
import { SessionProvider } from '../lib/useSession';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <I18nProvider>
      <SessionProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </I18nProvider>
  );
}
