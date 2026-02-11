import { ipcMain } from "electron";

export abstract class IpcController {
  abstract register(): void;

  protected handle(
    channel: string,
    listener: (...args: any[]) => Promise<any> | any,
  ) {
    ipcMain.handle(channel, async (event, ...args) => {
      try {
        return await listener(...args);
      } catch (error) {
        console.error(`Error in IPC handler for ${channel}:`, error);
        throw error;
      }
    });
  }
}
