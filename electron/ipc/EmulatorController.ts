import type { EmulatorInfo, IEmulatorService } from "../../src/shared/types.js";
import { IpcController } from "./IpcController.js";

export class EmulatorController extends IpcController {
  constructor(
    private readonly androidService: IEmulatorService,
    private readonly iosService: IEmulatorService,
  ) {
    super();
  }

  register(): void {
    this.handle("emulator:list", this.listEmulators.bind(this));
    this.handle("emulator:launch", this.launchEmulator.bind(this));
  }

  private async listEmulators(): Promise<EmulatorInfo[]> {
    console.log("Fetching emulator list...");
    const androids = await this.getSafely(this.androidService.listEmulators());

    const ios =
      process.platform === "darwin"
        ? await this.getSafely(this.iosService.listEmulators())
        : [];

    return [...androids, ...ios];
  }

  private async launchEmulator(emulator: EmulatorInfo): Promise<void> {
    console.log("Launching emulator:", emulator.name);
    if (emulator.platform === "android") {
      await this.androidService.launch(emulator);
    } else if (emulator.platform === "ios") {
      await this.iosService.launch(emulator);
    }
  }

  private async getSafely<T>(p: Promise<T[]>): Promise<T[]> {
    try {
      return await p;
    } catch (e) {
      console.error("Error fetching emulators:", e);
      return [];
    }
  }
}
