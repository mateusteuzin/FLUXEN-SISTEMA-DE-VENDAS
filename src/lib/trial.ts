const TRIAL_KEY = (userId: string) => `fluxen.trial.${userId}`;
const TRIAL_DAYS = 30; // Alterado de 7 para 30 dias
const WARNING_DAYS = 7; // Aviso quando faltarem 7 dias

interface TrialData {
  criadoEm: string;
  pagou: boolean;
}

const isBrowser = () => typeof window !== 'undefined';

export interface TrialStatus {
  daysUsed: number;
  daysLeft: number;
  isExpired: boolean;
  isWarning: boolean;
  isPaid: boolean;
  expirationDate: string; // Ex: "28/04/2026"
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const initTrial = (userId: string): void => {
  if (!isBrowser()) return;
  const key = TRIAL_KEY(userId);
  if (localStorage.getItem(key)) return;
  const data: TrialData = { criadoEm: new Date().toISOString(), pagou: false };
  localStorage.setItem(key, JSON.stringify(data));
};

const getTrialData = (userId: string): TrialData | null => {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(TRIAL_KEY(userId));
  if (!raw) return null;
  try { return JSON.parse(raw) as TrialData; } catch { return null; }
};

export const getTrialStatus = (userId: string): TrialStatus => {
  const data = getTrialData(userId);

  if (!data) {
    const defaultExp = new Date();
    defaultExp.setDate(defaultExp.getDate() + TRIAL_DAYS);
    return {
      daysUsed: 0,
      daysLeft: TRIAL_DAYS,
      isExpired: false,
      isWarning: false,
      isPaid: false,
      expirationDate: formatDate(defaultExp),
    };
  }

  const criadoEmDate = new Date(data.criadoEm);
  const expDate = new Date(criadoEmDate);
  expDate.setDate(expDate.getDate() + TRIAL_DAYS);

  if (data.pagou) {
    return {
      daysUsed: 0,
      daysLeft: Infinity,
      isExpired: false,
      isWarning: false,
      isPaid: true,
      expirationDate: 'Vitalício / Pro',
    };
  }

  const daysUsed = Math.floor(
    (Date.now() - criadoEmDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const daysLeft = Math.max(0, TRIAL_DAYS - daysUsed);

  return {
    daysUsed,
    daysLeft,
    isExpired: daysUsed >= TRIAL_DAYS,
    isWarning: daysLeft <= WARNING_DAYS && daysLeft > 0,
    isPaid: false,
    expirationDate: formatDate(expDate),
  };
};

export const markTrialAsPaid = (userId: string): void => {
  if (!isBrowser()) return;
  const data = getTrialData(userId);
  if (!data) return;
  localStorage.setItem(TRIAL_KEY(userId), JSON.stringify({ ...data, pagou: true }));
};

