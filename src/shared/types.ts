// ============================================================================
// Shared Types & Interfaces
// ============================================================================

export type Platform = "android" | "ios";

export interface EmulatorInfo {
  readonly id: string;
  readonly name: string;
  readonly platform: Platform;
  readonly state?: "available" | "booted" | "shutdown";
}

export interface IEmulatorService {
  listEmulators(): Promise<EmulatorInfo[]>;
  launch(emulator: EmulatorInfo): Promise<void>;
  checkAvailability(): Promise<boolean>;
}

export interface IUserInterface {
  // Common methods
  showError(message: string): void;
  showSuccess(message: string): void;

  // CLI specific methods
  showPlatformMenu(): Promise<Platform>;
  showEmulatorMenu(emulators: EmulatorInfo[]): Promise<EmulatorInfo>;
}

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export interface ICommandExecutor {
  execute(command: string, args?: readonly string[]): Promise<CommandResult>;
  spawn(command: string, args?: readonly string[]): void;
}

export interface IValidator {
  validateCommand(command: string): boolean;
  sanitizeArgs(args: string[]): string[];
}
