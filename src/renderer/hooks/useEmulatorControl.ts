import { useState, useCallback } from "react";
import { emulatorApi } from "../api/emulatorApi";

export function useEmulatorControl() {
  const [launchingId, setLaunchingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const launchEmulator = useCallback(
    async (id: string, platform: "android" | "ios") => {
      try {
        setLaunchingId(id);
        setError(null);
        const success = await emulatorApi.launch(id, platform);
        if (!success) {
          throw new Error("Failed to launch emulator");
        }
        return success;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to launch emulator",
        );
        return false;
      } finally {
        setLaunchingId(null);
      }
    },
    [],
  );

  return { launchEmulator, launchingId, error };
}
