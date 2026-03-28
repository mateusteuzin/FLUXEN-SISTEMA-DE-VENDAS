import { useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTrialStatus, initTrial, type TrialStatus } from '@/lib/trial';

const DEFAULT: TrialStatus = {
  daysUsed: 0,
  daysLeft: 30,
  isExpired: false,
  isWarning: false,
  isPaid: false,
  expirationDate: '--/--/----',
};

export function useTrial(): TrialStatus {
  const { user } = useAuth();

  useEffect(() => {
    if (user) initTrial(user.id);
  }, [user]);

  return useMemo(() => {
    if (!user) return DEFAULT;
    return getTrialStatus(user.id);
  }, [user]);
}
