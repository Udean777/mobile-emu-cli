import { AndroidService } from "../src/services/AndroidService.js";
import { IOSService } from "../src/services/IOSService.js";
import {
  InputValidator,
  SecureCommandExecutor,
} from "../src/services/CommandExecutor.js";
import type { IEmulatorService } from "../src/shared/types.js";

export class ServiceContainer {
  private androidService: AndroidService;
  private iosService: IOSService;
  private executor: SecureCommandExecutor;
  private validator: InputValidator;

  constructor() {
    this.validator = new InputValidator();
    this.executor = new SecureCommandExecutor(this.validator);
    this.androidService = new AndroidService(this.executor);
    this.iosService = new IOSService(this.executor);
  }

  getAndroidService(): IEmulatorService {
    return this.androidService;
  }

  getIOSService(): IEmulatorService {
    return this.iosService;
  }
}
