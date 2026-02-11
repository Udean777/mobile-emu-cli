import { execSync, spawn as nodeSpawn } from "node:child_process";
import type {
  CommandResult,
  ICommandExecutor,
  IValidator,
} from "../shared/types.js";

// ============================================================================
// Security Constants
// ============================================================================

/**
 * Whitelist of allowed commands to prevent arbitrary command execution
 */
const ALLOWED_COMMANDS = Object.freeze([
  "emulator", // Android emulator
  "xcrun", // Xcode command-line tools
  "open", // macOS open application
] as const);

/**
 * Regex pattern for valid device/emulator names
 * Only allows alphanumeric, spaces, hyphens, underscores, and parentheses
 */
const VALID_DEVICE_NAME_PATTERN = /^[\w\s\-().,]+$/;

/**
 * Maximum length for device names to prevent buffer overflow attacks
 */
const MAX_DEVICE_NAME_LENGTH = 128;

// ============================================================================
// Validator Implementation
// ============================================================================

export class InputValidator implements IValidator {
  /**
   * Validates that a device name contains only safe characters
   */
  isValidDeviceName(name: string): boolean {
    if (!name || typeof name !== "string") {
      return false;
    }

    if (name.length > MAX_DEVICE_NAME_LENGTH) {
      return false;
    }

    return VALID_DEVICE_NAME_PATTERN.test(name);
  }

  /**
   * Validates that the command is in the whitelist
   */
  validateCommand(command: string): boolean {
    const sanitizedCommand = this.sanitize(command);
    return ALLOWED_COMMANDS.includes(
      sanitizedCommand as (typeof ALLOWED_COMMANDS)[number],
    );
  }

  /**
   * Sanitizes input by removing potentially dangerous characters
   */
  sanitize(input: string): string {
    if (!input || typeof input !== "string") {
      return "";
    }

    // Remove null bytes and control characters
    return input
      .replace(/\0/g, "")
      .replace(/[\x00-\x1F\x7F]/g, "")
      .trim();
  }

  /**
   * Sanitizes arguments to prevent injection
   */
  sanitizeArgs(args: string[]): string[] {
    return args.map((arg) => {
      const sanitized = this.sanitize(arg);

      // Check for shell metacharacters that could be used for injection
      if (/[;&|`$()]/.test(sanitized)) {
        throw new Error(`Argument contains invalid characters: ${arg}`);
      }

      return sanitized;
    });
  }
}

// ============================================================================
// Command Executor Implementation
// ============================================================================

export class SecureCommandExecutor implements ICommandExecutor {
  private readonly validator: IValidator;

  constructor(validator: IValidator) {
    this.validator = validator;
  }

  /**
   * Validates that the command is in the whitelist
   */
  private validateCommand(command: string): void {
    const sanitizedCommand =
      this.validator instanceof InputValidator
        ? (this.validator as InputValidator).sanitize(command)
        : command.trim();

    if (
      !ALLOWED_COMMANDS.includes(
        sanitizedCommand as (typeof ALLOWED_COMMANDS)[number],
      )
    ) {
      throw new Error(`Command not allowed: ${command}`);
    }
  }

  /**
   * Sanitizes arguments to prevent injection
   */
  private sanitizeArgs(args: readonly string[]): string[] {
    return args.map((arg) => {
      // Use internal sanitize method
      const sanitized =
        this.validator instanceof InputValidator
          ? (this.validator as InputValidator).sanitize(arg)
          : arg.trim(); // Fallback if validator doesn't expose sanitize

      // Check for shell metacharacters that could be used for injection
      if (/[;&|`$()]/.test(sanitized)) {
        throw new Error(`Argument contains invalid characters: ${arg}`);
      }

      return sanitized;
      return sanitized;
    });
  }

  /**
   * Executes a command synchronously and returns the result
   */
  async execute(
    command: string,
    args: readonly string[],
  ): Promise<CommandResult> {
    this.validateCommand(command);
    const sanitizedArgs = this.sanitizeArgs(args);

    try {
      // Use execSync with explicit encoding and no shell
      const stdout = execSync(`${command} ${sanitizedArgs.join(" ")}`, {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
        timeout: 30000, // 30 second timeout
      });

      return {
        stdout: stdout.trim(),
        stderr: "",
        exitCode: 0,
      };
    } catch (error: unknown) {
      const execError = error as {
        status?: number;
        stderr?: Buffer;
        message?: string;
      };
      return {
        stdout: "",
        stderr:
          execError.stderr?.toString() ?? execError.message ?? "Unknown error",
        exitCode: execError.status ?? 1,
      };
    }
  }

  /**
   * Spawns a detached process (for launching emulators)
   */
  spawn(command: string, args: readonly string[]): void {
    this.validateCommand(command);
    const sanitizedArgs = this.sanitizeArgs(args);

    const process = nodeSpawn(command, sanitizedArgs, {
      detached: true,
      stdio: "ignore",
    });

    process.unref();
  }
}
