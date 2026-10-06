import { useCallback, useEffect, useState } from 'react';
import { loadMatchPrefs, saveMatchPrefs, type MatchPreferences } from '@/storage/preferences';

/** Estado do Modo Partida, persistido localmente entre rounds/sessões. */
export function useMatchPrefs() {
  const [prefs, setPrefs] = useState<MatchPreferences>(loadMatchPrefs);

  useEffect(() => saveMatchPrefs(prefs), [prefs]);

  const update = useCallback(<K extends keyof MatchPreferences>(key: K, value: MatchPreferences[K]) => {
    setPrefs((p) => (p[key] === value ? p : { ...p, [key]: value }));
  }, []);

  return { prefs, update, setPrefs };
}
