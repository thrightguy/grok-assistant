# Grok Assistant

Grok Assistant is a Visual Studio Code extension that integrates with Grok.com to provide AI-powered code suggestions and chat functionality. This extension is designed to enhance your coding experience by offering intelligent suggestions and a seamless chat interface.

## Features

- **AI-Powered Code Suggestions**: Get intelligent code suggestions as you type.
- **Chat Interface**: Open a chat view to interact with Grok's AI for coding assistance.
- **Activity Bar Integration**: Access Grok Assistant directly from the activity bar.

## Installation

1. Download the `.vsix` file from the [Releases](https://github.com/thrightguy/grok-assistant/releases) page.
2. Open Visual Studio Code.
3. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window.
4. Click on the `...` menu in the Extensions view and select `Install from VSIX...`.
5. Select the downloaded `.vsix` file to install the extension.

## Usage

### Commands

- **Grok Assistant: Get Suggestions**
  - Command: `grok-assistant.getSuggestions`
  - Description: Provides AI-powered code suggestions.

- **Grok Assistant: Open Chat**
  - Command: `grok-assistant.openChat`
  - Description: Opens the chat interface for interacting with Grok's AI.

### Activity Bar

- Grok Assistant is accessible from the Activity Bar. Click on the Grok Assistant icon to open the chat view.

## Development

### Prerequisites

- Node.js and npm installed.
- Visual Studio Code installed.

### Build and Run

1. Clone the repository:
   ```bash
   git clone https://github.com/thrightguy/grok-assistant.git
   cd grok-assistant
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile the extension:
   ```bash
   npm run compile
   ```
4. Launch the extension in a new VS Code window:
   - Press `F5` in Visual Studio Code.

### Packaging

To package the extension into a `.vsix` file:
```bash
vsce package
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.