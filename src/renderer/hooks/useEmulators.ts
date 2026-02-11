import { useState, useEffect, useCallback } from "react";
import type { EmulatorInfo } from "../../shared/types";
import { emulatorApi } from "../api/emulatorApi";

export function useEmulators() {
  const [emulators, setEmulators] = useState<EmulatorInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmulators = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await emulatorApi.list();
      setEmulators(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load emulators");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmulators();
  }, [fetchEmulators]);

  return { emulators, loading, error, refresh: fetchEmulators };
}
