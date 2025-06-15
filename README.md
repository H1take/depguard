# DepGuard

A powerful CLI tool to check and update npm/yarn dependencies in your projects. Automatically detects your package manager and provides an interactive interface for managing dependencies.

## Features

- 🎯 Automatic package manager detection (npm/yarn)
- 🔍 Check for outdated dependencies
- 📊 Group updates by type (major, minor, patch)
- 🔒 Safe update mode for compatible versions
- 💻 Interactive update mode
- 📦 Update specific packages
- 📝 Detailed dependency reports
- ⚙️ Configurable package exclusions
- 🔄 Progress indicators for long-running operations

## Installation

```bash
# Using npm
npm install -g depguard

# Using yarn
yarn global add depguard
```

## Usage

### Check Dependencies

```bash
# Basic check
depguard check

# Interactive mode
depguard check -i

# Output in different formats
depguard check -o json
depguard check -o csv
```

This will show you a list of outdated dependencies grouped by update type:
- Major updates (⚠️)
- Minor updates (↑)
- Patch updates (↑)
- Compatible versions (✓)

### Update Dependencies

```bash
# Update all dependencies
depguard update

# Update only compatible versions
depguard update -s

# Update specific package
depguard update -p package-name

# Interactive mode
depguard update -i
```

In interactive mode, you can:
- Choose to update all dependencies
- Update only compatible versions
- Update specific packages
- See progress of updates in real-time

## Configuration

Create a `.depguard.json` file in your project root to configure the tool:

```json
{
  "exclude": ["package1", "package2"],
  "packageManager": "npm"
}
```

### Configuration Options

- `exclude`: Array of package names to exclude from updates
- `packageManager`: Force specific package manager ("npm" or "yarn")

## Development

```bash
# Clone the repository
git clone https://github.com/h1take/depguard.git
cd depguard

# Install dependencies
npm install

# Run in development mode
npm start

# Build
npm run build

# Run tests
npm test

# Lint
npm run lint

# Format code
npm run format
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Author

Dmitriy Yakovlev - [@dmitriyyakovlev](https://github.com/h1take) 