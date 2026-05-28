import { SafeUser } from '../types';

const TOKEN_KEY = 'wc_token';
const USER_KEY = 'wc_user';
const LOCALE_KEY = 'wc_locale';

export function saveSession(token: string, user: SafeUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken(): string | null {
  return typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY);
}

export function getUser(): SafeUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as SafeUser) : null;
}

export function getStoredLocale(): string {
  if (typeof window === 'undefined') {
    return 'en';
  }
  return localStorage.getItem(LOCALE_KEY) || 'en';
}

export function setStoredLocale(locale: string) {
  localStorage.setItem(LOCALE_KEY, locale);
}
