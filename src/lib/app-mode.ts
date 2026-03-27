const configuredMode = (import.meta.env.VITE_APP_MODE ?? '').toLowerCase();

export const hasSupabaseConfig = Boolean(
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

export const appMode = configuredMode === 'local' || !hasSupabaseConfig
  ? 'local'
  : 'supabase';

export const isLocalMode = appMode === 'local';
