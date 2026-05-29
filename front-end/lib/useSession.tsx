import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { SafeUser, SessionState } from '../types';
import { clearSession, getToken, getUser, saveSession } from './session';

type SessionContextValue = SessionState & {
  signIn: (token: string, user: SafeUser) => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<SafeUser | null>(null);

  useEffect(() => {
    setToken(getToken());
    setUser(getUser());
  }, []);

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: Boolean(token && user),
    signIn: (nextToken: string, nextUser: SafeUser) => {
      saveSession(nextToken, nextUser);
      setToken(nextToken);
      setUser(nextUser);
    },
    signOut: () => {
      clearSession();
      setToken(null);
      setUser(null);
    }
  }), [token, user]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used inside SessionProvider');
  }
  return context;
}
