import type { EmulatorInfo } from "../../shared/types";

// Define the shape of the Electron API exposed via preload
interface ElectronAPI {
  listEmulators: () => Promise<EmulatorInfo[]>;
  launchEmulator: (emulator: EmulatorInfo) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export const emulatorApi = {
  list: async (): Promise<EmulatorInfo[]> => {
    return window.electronAPI.listEmulators();
  },

  launch: async (emulator: EmulatorInfo): Promise<void> => {
    return window.electronAPI.launchEmulator(emulator);
  },
};
