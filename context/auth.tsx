import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

export type Role = 'cupid' | 'match' | 'both';

export interface CupidCredit {
  id: string;
  from: string;
  matchName: string;
  pts: number;
}

export interface OnboardingData {
  name: string;
  age: string;
  role: Role;
  interests: string[];
  lookingFor: string;
  prompts: { question: string; answer: string }[];
}

interface AuthState extends OnboardingData {
  onboarded: boolean;
  cupidCredits: CupidCredit[];
}

interface AuthCtx extends AuthState {
  completeOnboarding: (data: OnboardingData) => void;
  addCupidCredit: (from: string, matchName: string, pts: number) => void;
  clearCupidCredits: () => void;
}

const Context = createContext<AuthCtx | null>(null);

const DEFAULTS: AuthState = {
  onboarded: false,
  name: '',
  age: '',
  role: 'both',
  interests: [],
  lookingFor: '',
  prompts: [],
  cupidCredits: [],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(DEFAULTS);

  const completeOnboarding = useCallback((data: OnboardingData) => {
    setState(s => ({ ...s, ...data, onboarded: true }));
  }, []);

  const addCupidCredit = useCallback((from: string, matchName: string, pts: number) => {
    setState(s => ({
      ...s,
      cupidCredits: [{ id: Date.now().toString(), from, matchName, pts }, ...s.cupidCredits],
    }));
  }, []);

  const clearCupidCredits = useCallback(() => {
    setState(s => ({ ...s, cupidCredits: [] }));
  }, []);

  return (
    <Context.Provider value={{ ...state, completeOnboarding, addCupidCredit, clearCupidCredits }}>
      {children}
    </Context.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
