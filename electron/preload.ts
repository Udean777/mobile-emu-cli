import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  listEmulators: () => ipcRenderer.invoke("emulator:list"),
  launchEmulator: (emulator: any) =>
    ipcRenderer.invoke("emulator:launch", emulator),
});
