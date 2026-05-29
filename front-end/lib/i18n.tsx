import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { getStoredLocale, setStoredLocale } from './session';

type Locale = 'en' | 'nl' | 'fr';

const dictionary: Record<Locale, Record<string, string>> = {
  en: {
    home: 'Home', login: 'Login', register: 'Register', matches: 'Matches', stats: 'Stats', admin: 'Admin', referee: 'Referee',
    currentRound: 'Current round', restricted: 'Restricted access', goToLogin: 'Go to login', goToRegister: 'Go to register',
    predefinedAccess: 'Predefined Access', signIn: 'Sign In', createAccount: 'Create Account'
  },
  nl: {
    home: 'Start', login: 'Aanmelden', register: 'Registreren', matches: 'Wedstrijden', stats: 'Statistieken', admin: 'Admin', referee: 'Scheidsrechter',
    currentRound: 'Huidige ronde', restricted: 'Beperkte toegang', goToLogin: 'Ga naar aanmelden', goToRegister: 'Ga naar registreren',
    predefinedAccess: 'Vooraf ingestelde toegang', signIn: 'Aanmelden', createAccount: 'Account aanmaken'
  },
  fr: {
    home: 'Accueil', login: 'Connexion', register: 'Inscription', matches: 'Matchs', stats: 'Statistiques', admin: 'Admin', referee: 'Arbitre',
    currentRound: 'Tour actuel', restricted: 'Acces limite', goToLogin: 'Aller a la connexion', goToRegister: 'Aller a inscription',
    predefinedAccess: 'Acces predefini', signIn: 'Se connecter', createAccount: 'Creer un compte'
  }
};

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function isLocale(value: string): value is Locale {
  return value === 'en' || value === 'nl' || value === 'fr';
}

export function I18nProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const storedLocale = getStoredLocale();
    if (isLocale(storedLocale)) {
      setLocaleState(storedLocale);
    }
  }, []);

  const setLocale = (value: Locale) => {
    setLocaleState(value);
    setStoredLocale(value);
  };

  const value = useMemo(() => ({
    locale,
    setLocale,
    t: (key: string) => dictionary[locale][key] || key
  }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider');
  }
  return context;
}
