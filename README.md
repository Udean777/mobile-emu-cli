# mobile-emu-cli

CLI tool to list and launch **Android Emulators** and **iOS Simulators** easily from your terminal.

## Features

- 🤖 **Android Emulator** support via Android SDK
- 🍎 **iOS Simulator** support via Xcode (macOS only)
- 🔒 **Secure** - Command whitelisting and input sanitization
- 📱 **Interactive** - Beautiful CLI menu interface
- ⚡ **Fast** - Lightweight with minimal dependencies

## Installation

```bash
npm install -g mobile-emu-cli
```

### Platform-Specific Setup

After installation, you may need to configure your PATH to use the `mobile-emu` command globally.

#### 🍎 macOS

```bash
# Add to ~/.zshrc (or ~/.bash_profile if using Bash)
export PATH="$HOME/.npm-global/bin:$PATH"

# Apply changes
source ~/.zshrc
```

#### 🐧 Linux

```bash
# Add to ~/.bashrc
export PATH="$HOME/.npm-global/bin:$PATH"

# Apply changes
source ~/.bashrc
```

#### 🪟 Windows

npm global packages are usually added to PATH automatically when Node.js is installed. If the command is not found:

**PowerShell (Run as Administrator):**

```powershell
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";$env:APPDATA\npm", "User")
```

**Or manually:**

1. Open **System Properties** → **Environment Variables**
2. Edit **Path** under User variables
3. Add `%APPDATA%\npm`

### Troubleshooting

If you get `command not found: mobile-emu` after installation:

1. **Check npm global bin path:**

   ```bash
   npm bin -g
   ```

2. **Verify the package is installed:**

   ```bash
   npm list -g mobile-emu-cli
   ```

3. **Run directly using npx (no PATH needed):**
   ```bash
   npx mobile-emu-cli
   ```

## Prerequisites

### For Android Emulators

- Android SDK installed with `emulator` command available in PATH
- At least one Android Virtual Device (AVD) created via Android Studio

### For iOS Simulators (macOS only)

- Xcode installed with Command Line Tools
- At least one iOS Simulator available

To install Xcode Command Line Tools:

```bash
xcode-select --install
```

## Usage

### Interactive Mode (Default)

Simply run:

```bash
mobile-emu
```

This will:

1. Detect available platforms (Android/iOS)
2. Let you select a platform (if both available)
3. List all available emulators/simulators
4. Let you select one from an interactive menu
5. Launch the selected emulator/simulator

### CLI Options

```
mobile-emu [OPTIONS]

OPTIONS:
  -l, --list              List available emulators/simulators (non-interactive)
  -p, --platform <name>   Specify platform: 'android' or 'ios'
  -d, --device <name>     Specify device name to launch directly
  -h, --help              Show help message
  -v, --version           Show version number
```

### Examples

```bash
# Interactive mode
mobile-emu

# List all available devices
mobile-emu --list

# List only Android emulators
mobile-emu --list --platform android

# List only iOS simulators
mobile-emu -l -p ios

# Interactive selection for specific platform
mobile-emu --platform android

# Launch specific device directly (non-interactive)
mobile-emu --platform android --device "Pixel_9_Pro"
mobile-emu -p ios -d "iPhone 17 Pro"
```

## Requirements

- Node.js 18.0.0 or higher
- macOS, Linux, or Windows
- Android SDK (for Android Emulators)
- Xcode (for iOS Simulators, macOS only)

## Security

This CLI implements security best practices:

- **Command Whitelisting**: Only allowed commands can be executed
- **Input Sanitization**: All inputs are validated and sanitized
- **No Shell Execution**: Uses spawn with array arguments to prevent injection

## License

MIT
oke
