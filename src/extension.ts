import * as vscode from "vscode";
import axios from "axios";

/**
 * Activates the extension
 * @param context VS Code extension context
 */
function activate(context: vscode.ExtensionContext) {
  console.log("Grok Assistant is active");

  // Register command for code suggestions
  let getSuggestions = vscode.commands.registerCommand(
    "grok-assistant.getSuggestions",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor");
        return;
      }

      const selection = editor.document.getText(editor.selection);
      const apiKey = vscode.workspace
        .getConfiguration("grokAssistant")
        .get("apiKey");
      if (!apiKey) {
        vscode.window.showErrorMessage("Please set Grok API key in settings");
        return;
      }

      try {
        const response = await axios.post(
          "https://api.x.ai/v1/grok",
          {
            prompt: `Suggest code completion for: ${selection}`,
            model: "grok-3",
          },
          {
            headers: { Authorization: `Bearer ${apiKey}` },
          }
        );

        const suggestion = response.data.choices[0].text;
        editor.edit((editBuilder: vscode.TextEditorEdit) => {
          editBuilder.insert(editor.selection.active, suggestion);
        });
        vscode.window.showInformationMessage("Suggestion inserted");
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        vscode.window.showErrorMessage(`Error fetching suggestion: ${message}`);
      }
    }
  );

  // Register command for chat interface
  let openChat = vscode.commands.registerCommand(
    "grok-assistant.openChat",
    () => {
      const panel = vscode.window.createWebviewPanel(
        "grokChat",
        "Grok Assistant Chat",
        vscode.ViewColumn.One,
        { enableScripts: true }
      );

      panel.webview.html = getWebviewContent();
      panel.webview.onDidReceiveMessage(
        async (message: { command: string; text: string }) => {
          if (message.command === "sendMessage") {
            const apiKey = vscode.workspace
              .getConfiguration("grokAssistant")
              .get("apiKey");
            if (!apiKey) {
              panel.webview.postMessage({
                command: "error",
                text: "Please set Grok API key in settings",
              });
              return;
            }

            try {
              const response = await axios.post(
                "https://api.x.ai/v1/grok",
                {
                  prompt: message.text,
                  model: "grok-3",
                },
                {
                  headers: { Authorization: `Bearer ${apiKey}` },
                }
              );

              panel.webview.postMessage({
                command: "receiveMessage",
                text: response.data.choices[0].text,
              });
            } catch (error: unknown) {
              const message =
                error instanceof Error ? error.message : "Unknown error";
              panel.webview.postMessage({
                command: "error",
                text: `Error: ${message}`,
              });
            }
          }
        }
      );
    }
  );

  // Register Activity Bar view
  const chatProvider = new ChatViewProvider(context.extensionUri);
  vscode.window.registerTreeDataProvider("grokAssistantView", chatProvider);
  vscode.commands.registerCommand("grokAssistantView.openChat", () =>
    vscode.commands.executeCommand("grok-assistant.openChat")
  );

  context.subscriptions.push(getSuggestions, openChat);
}

function getWebviewContent(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Grok Chat</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 10px; background: #1e1e1e; color: #fff; }
        #chat { height: 80vh; overflow-y: auto; border: 1px solid #444; padding: 10px; }
        #input { width: 100%; padding: 8px; margin-top: 10px; background: #333; color: #fff; border: 1px solid #444; }
      </style>
    </head>
    <body>
      <div id="chat"></div>
      <input id="input" type="text" placeholder="Ask Grok...">
      <script>
        const vscode = acquireVsCodeApi();
        const chat = document.getElementById('chat');
        const input = document.getElementById('input');

        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter' && input.value.trim()) {
            const message = input.value;
            chat.innerHTML += '<p><strong>You:</strong> ' + message + '</p>';
            vscode.postMessage({ command: 'sendMessage', text: message });
            input.value = '';
            chat.scrollTop = chat.scrollHeight;
          }
        });

        window.addEventListener('message', event => {
          const message = event.data;
          if (message.command === 'receiveMessage') {
            chat.innerHTML += '<p><strong>Grok:</strong> ' + message.text + '</p>';
            chat.scrollTop = chat.scrollHeight;
          } else if (message.command === 'error') {
            chat.innerHTML += '<p style="color: red;"><strong>Error:</strong> ' + message.text + '</p>';
            chat.scrollTop = chat.scrollHeight;
          }
        });
      </script>
    </body>
    </html>
  `;
}

class ChatViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  private _extensionUri: vscode.Uri;

  constructor(extensionUri: vscode.Uri) {
    this._extensionUri = extensionUri;
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(): vscode.TreeItem[] {
    return [
      {
        label: "Grok Assistant Chat",
        command: {
          command: "grokAssistantView.openChat",
          title: "Open Grok Chat",
        },
        collapsibleState: vscode.TreeItemCollapsibleState.None,
      },
    ];
  }
}

function deactivate() {}

export = {
  activate,
  deactivate,
};
