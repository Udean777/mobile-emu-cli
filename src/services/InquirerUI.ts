import { select } from "@inquirer/prompts";
import type {
  EmulatorInfo,
  IUserInterface,
  Platform,
} from "../shared/types.js";

// ============================================================================
// Platform Display Names
// ============================================================================

const PLATFORM_DISPLAY: Record<Platform, { name: string; emoji: string }> = {
  android: { name: "Android Emulator", emoji: "🤖" },
  ios: { name: "iOS Simulator", emoji: "🍎" },
};

// ============================================================================
// Inquirer UI Implementation
// ============================================================================

export class InquirerUI implements IUserInterface {
  /**
   * Shows platform selection menu
   */
  async showPlatformMenu(): Promise<Platform> {
    const platform = await select<Platform>({
      message: "📱 Select Platform:",
      choices: [
        {
          name: `${PLATFORM_DISPLAY.android.emoji} ${PLATFORM_DISPLAY.android.name}`,
          value: "android" as Platform,
        },
        {
          name: `${PLATFORM_DISPLAY.ios.emoji} ${PLATFORM_DISPLAY.ios.name}`,
          value: "ios" as Platform,
        },
      ],
    });

    return platform;
  }

  /**
   * Shows emulator selection menu
   */
  async showEmulatorMenu(emulators: EmulatorInfo[]): Promise<EmulatorInfo> {
    const platform = emulators[0]?.platform ?? "android";
    const display = PLATFORM_DISPLAY[platform];

    const choices = emulators.map((emu) => ({
      name: this.formatEmulatorName(emu),
      value: emu,
    }));

    const selected = await select<EmulatorInfo>({
      message: `${display.emoji} Select ${display.name}:`,
      choices,
    });

    return selected;
  }

  /**
   * Formats emulator name with state indicator
   */
  private formatEmulatorName(emulator: EmulatorInfo): string {
    const stateIndicator = emulator.state === "booted" ? " 🟢 (running)" : "";
    return `${emulator.name}${stateIndicator}`;
  }

  /**
   * Shows an informational message
   */
  showMessage(msg: string): void {
    console.log(msg);
  }

  /**
   * Shows an error message
   */
  showError(msg: string): void {
    console.error(`❌ ${msg}`);
  }

  /**
   * Shows a success message
   */
  showSuccess(msg: string): void {
    console.log(`✅ ${msg}`);
  }
}
