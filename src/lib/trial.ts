const TRIAL_KEY = (userId: string) => `fluxen.trial.${userId}`;
const TRIAL_DAYS = 7;
const WARNING_DAYS = 5;

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
}

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
    return { daysUsed: 0, daysLeft: TRIAL_DAYS, isExpired: false, isWarning: false, isPaid: false };
  }

  if (data.pagou) {
    return { daysUsed: 0, daysLeft: Infinity, isExpired: false, isWarning: false, isPaid: true };
  }

  const daysUsed = Math.floor(
    (Date.now() - new Date(data.criadoEm).getTime()) / (1000 * 60 * 60 * 24),
  );
  const daysLeft = Math.max(0, TRIAL_DAYS - daysUsed);

  return {
    daysUsed,
    daysLeft,
    isExpired: daysUsed >= TRIAL_DAYS,
    isWarning: daysUsed >= WARNING_DAYS && daysUsed < TRIAL_DAYS,
    isPaid: false,
  };
};

export const markTrialAsPaid = (userId: string): void => {
  if (!isBrowser()) return;
  const data = getTrialData(userId);
  if (!data) return;
  localStorage.setItem(TRIAL_KEY(userId), JSON.stringify({ ...data, pagou: true }));
};
