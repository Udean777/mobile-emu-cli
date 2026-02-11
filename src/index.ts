#!/usr/bin/env node

import { EmulatorServiceFactory } from "./services/EmulatorServiceFactory.js";
import { InquirerUI } from "./services/InquirerUI.js";
import {
  InputValidator,
  SecureCommandExecutor,
} from "./services/CommandExecutor.js";
import type {
  IEmulatorService,
  IUserInterface,
  Platform,
} from "./shared/types.js";

// ============================================================================
// CLI Arguments Parser
// ============================================================================

interface CLIOptions {
  list: boolean;
  platform?: Platform;
  device?: string;
  help: boolean;
  version: boolean;
}

function parseArgs(args: string[]): CLIOptions {
  const options: CLIOptions = {
    list: false,
    help: false,
    version: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case "--list":
      case "-l":
        options.list = true;
        break;

      case "--platform":
      case "-p":
        const platformValue = args[++i];
        if (platformValue === "android" || platformValue === "ios") {
          options.platform = platformValue;
        } else {
          console.error(
            `❌ Invalid platform: ${platformValue}. Use 'android' or 'ios'.`,
          );
          process.exit(1);
        }
        break;

      case "--device":
      case "-d":
        const deviceValue = args[++i];
        if (deviceValue) {
          options.device = deviceValue;
        }
        break;

      case "--help":
      case "-h":
        options.help = true;
        break;

      case "--version":
      case "-v":
        options.version = true;
        break;
    }
  }

  return options;
}

function showHelp(): void {
  console.log(`
mobile-emu - CLI tool to list and launch Android Emulators and iOS Simulators

USAGE:
  mobile-emu [OPTIONS]

OPTIONS:
  -l, --list              List available emulators/simulators (non-interactive)
  -p, --platform <name>   Specify platform: 'android' or 'ios'
  -d, --device <name>     Specify device name to launch directly
  -h, --help              Show this help message
  -v, --version           Show version number

EXAMPLES:
  mobile-emu                           # Interactive mode
  mobile-emu --list                    # List all devices
  mobile-emu --list --platform android # List Android emulators only
  mobile-emu --platform ios            # Interactive iOS selection
  mobile-emu -p android -d "Pixel_8"   # Launch specific device
`);
}

function showVersion(): void {
  console.log("mobile-emu-cli v1.0.2");
}

// ============================================================================
// Application Class
// ============================================================================

class App {
  private readonly ui: IUserInterface;
  private readonly serviceFactory: EmulatorServiceFactory;

  constructor(ui: IUserInterface, serviceFactory: EmulatorServiceFactory) {
    this.ui = ui;
    this.serviceFactory = serviceFactory;
  }

  /**
   * List emulators for a specific platform or all platforms
   */
  async listEmulators(platform?: Platform): Promise<void> {
    const availablePlatforms =
      await this.serviceFactory.getAvailablePlatforms();

    if (availablePlatforms.length === 0) {
      this.ui.showError(
        "No platforms available. Make sure Android SDK or Xcode is installed.",
      );
      return;
    }

    const platformsToList = platform
      ? availablePlatforms.filter((p) => p === platform)
      : availablePlatforms;

    if (platformsToList.length === 0) {
      this.ui.showError(
        `Platform '${platform}' is not available on this system.`,
      );
      return;
    }

    for (const p of platformsToList) {
      const service = this.serviceFactory.create(p);
      const emulators = await service.listEmulators();

      const platformEmoji = p === "android" ? "🤖" : "🍎";
      const platformName =
        p === "android" ? "Android Emulators" : "iOS Simulators";

      console.log(`\n${platformEmoji} ${platformName}:`);

      if (emulators.length === 0) {
        console.log("  (none found)");
      } else {
        emulators.forEach((emu) => {
          const stateStr = emu.state ? ` [${emu.state}]` : "";
          console.log(`  • ${emu.name}${stateStr}`);
        });
      }
    }
    console.log();
  }

  /**
   * Launch a specific device by name
   */
  async launchDevice(platform: Platform, deviceName: string): Promise<void> {
    const service = this.serviceFactory.create(platform);
    const emulators = await service.listEmulators();

    const device = emulators.find(
      (emu) =>
        emu.name.toLowerCase() === deviceName.toLowerCase() ||
        emu.id.toLowerCase() === deviceName.toLowerCase(),
    );

    if (!device) {
      this.ui.showError(
        `Device '${deviceName}' not found for platform '${platform}'.`,
      );
      console.log("\nAvailable devices:");
      emulators.forEach((emu) => console.log(`  • ${emu.name}`));
      process.exit(1);
    }

    const platformEmoji = platform === "android" ? "🤖" : "🍎";
    this.ui.showSuccess(`🚀 Launching ${device.name}...`);

    await service.launch(device);

    this.ui.showSuccess(
      `${platformEmoji} ✅ Success. You can close this terminal.`,
    );
  }

  /**
   * Main application entry point (interactive mode)
   */
  async run(preselectedPlatform?: Platform): Promise<void> {
    try {
      // Step 1: Check available platforms
      const availablePlatforms =
        await this.serviceFactory.getAvailablePlatforms();

      if (availablePlatforms.length === 0) {
        this.ui.showError(
          "No platforms available. Make sure Android SDK or Xcode is installed.",
        );
        return;
      }

      // Step 2: Select platform
      let platform: Platform;

      if (preselectedPlatform) {
        if (!availablePlatforms.includes(preselectedPlatform)) {
          this.ui.showError(
            `Platform '${preselectedPlatform}' is not available on this system.`,
          );
          return;
        }
        platform = preselectedPlatform;
        this.ui.showSuccess(
          `📱 Using ${platform === "android" ? "Android" : "iOS"}...`,
        );
      } else if (availablePlatforms.length === 1) {
        // If only one platform available, use it directly
        platform = availablePlatforms[0]!;
        this.ui.showSuccess(
          `📱 Using ${platform === "android" ? "Android" : "iOS"}...`,
        );
      } else {
        // Let user choose
        platform = await this.ui.showPlatformMenu();
      }

      // Step 3: Get emulator service
      const service: IEmulatorService = this.serviceFactory.create(platform);

      // Step 4: List emulators
      const emulators = await service.listEmulators();

      if (emulators.length === 0) {
        const platformName =
          platform === "android" ? "Android Emulator" : "iOS Simulator";
        this.ui.showError(`No ${platformName} found.`);
        return;
      }

      // Step 5: Select emulator
      const selected = await this.ui.showEmulatorMenu(emulators);

      // Step 6: Launch
      const platformEmoji = platform === "android" ? "🤖" : "🍎";
      this.ui.showSuccess(`🚀 Launching ${selected.name}...`);

      await service.launch(selected);

      this.ui.showSuccess(
        `${platformEmoji} ✅ Success. You can close this terminal.`,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.ui.showError(message);
      process.exit(1);
    }
  }
}

// ============================================================================
// Entry Point
// ============================================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  // Handle --help
  if (options.help) {
    showHelp();
    return;
  }

  // Handle --version
  if (options.version) {
    showVersion();
    return;
  }

  // Setup dependencies (Dependency Injection)
  const validator = new InputValidator();
  const commandExecutor = new SecureCommandExecutor(validator);
  const serviceFactory = new EmulatorServiceFactory(commandExecutor);
  const ui = new InquirerUI();

  const app = new App(ui, serviceFactory);

  // Handle --list
  if (options.list) {
    await app.listEmulators(options.platform);
    return;
  }

  // Handle --device (requires --platform)
  if (options.device) {
    if (!options.platform) {
      console.error("❌ Error: --device requires --platform to be specified.");
      console.error(
        "   Example: mobile-emu --platform android --device Pixel_8",
      );
      process.exit(1);
    }
    await app.launchDevice(options.platform, options.device);
    return;
  }

  // Interactive mode (default)
  await app.run(options.platform);
}

main();
