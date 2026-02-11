import type {
  ICommandExecutor,
  IEmulatorService,
  Platform,
} from "../shared/types.js";
import { AndroidService } from "./AndroidService.js";
import { IOSService } from "./IOSService.js";

// ============================================================================
// Emulator Service Factory (Open/Closed Principle)
// ============================================================================

/**
 * Factory for creating emulator service based on platform
 * Follows Open/Closed Principle - easy to extend without modifying
 */
export class EmulatorServiceFactory {
  private readonly commandExecutor: ICommandExecutor;

  constructor(commandExecutor: ICommandExecutor) {
    this.commandExecutor = commandExecutor;
  }

  /**
   * Creates the appropriate emulator service for the given platform
   */
  create(platform: Platform): IEmulatorService {
    switch (platform) {
      case "android":
        return new AndroidService(this.commandExecutor);
      case "ios":
        return new IOSService(this.commandExecutor);
      default:
        // TypeScript exhaustive check
        const _exhaustive: never = platform;
        throw new Error(`Unknown platform: ${_exhaustive}`);
    }
  }

  /**
   * Returns all available platforms on the current system
   */
  async getAvailablePlatforms(): Promise<Platform[]> {
    const platforms: Platform[] = [];

    const androidService = new AndroidService(this.commandExecutor);
    const iosService = new IOSService(this.commandExecutor);

    const [androidAvailable, iosAvailable] = await Promise.all([
      androidService.checkAvailability(),
      iosService.checkAvailability(),
    ]);

    if (androidAvailable) {
      platforms.push("android");
    }

    if (iosAvailable) {
      platforms.push("ios");
    }

    return platforms;
  }
}
