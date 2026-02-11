import type {
  EmulatorInfo,
  ICommandExecutor,
  IEmulatorService,
  Platform,
} from "../shared/types.js";

// ============================================================================
// Android Emulator Service
// ============================================================================

export class AndroidService implements IEmulatorService {
  readonly platform: Platform = "android";

  constructor(private readonly commandExecutor: ICommandExecutor) {}

  /**
   * Checks if Android SDK emulator is available
   */
  async checkAvailability(): Promise<boolean> {
    try {
      const result = await this.commandExecutor.execute("emulator", [
        "-list-avds",
      ]);
      return result.exitCode === 0;
    } catch {
      return false;
    }
  }

  /**
   * Lists all available Android emulators
   */
  async listEmulators(): Promise<EmulatorInfo[]> {
    const result = await this.commandExecutor.execute("emulator", [
      "-list-avds",
    ]);

    if (result.exitCode !== 0) {
      throw new Error(
        "Android SDK not found or 'emulator' command is not in PATH.",
      );
    }

    return result.stdout
      .trim()
      .split("\n")
      .filter((name) => name.length > 0)
      .map((name) => ({
        id: name,
        name: name,
        platform: "android" as Platform,
        state: "available" as const,
      }));
  }

  /**
   * Launches the specified Android emulator
   */
  async launch(emulator: EmulatorInfo): Promise<void> {
    // Use spawn to run the process detached from the main terminal
    this.commandExecutor.spawn("emulator", [`@${emulator.id}`]);
  }
}
