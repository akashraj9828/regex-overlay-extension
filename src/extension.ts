import * as vscode from "vscode";

interface SelectorConfig {
  fileSelector: string; // regex
  textSelector: string; // regex
}

let outputChannel: vscode.OutputChannel;
let debugMode: boolean = true; // Debug flag

function log(message: string) {
  if (debugMode) {
    console.log(message);
    // outputChannel.show(true);
    // outputChannel.appendLine(message);
  }
}

export function activate(context: vscode.ExtensionContext) {
  // const decorationType = vscode.window.createTextEditorDecorationType({
  //   after: {
  //     contentText: " Your Text Here",
  //     color: "rgba(255, 0, 0, 0.8)", // Example color
  //     backgroundColor: "rgba(255, 255, 255, 0.5)", // Optional background
  //   },
  // });

  // const editor = vscode.window.activeTextEditor;

  // if (editor) {
  //   const lineCount = editor.document.lineCount;
  //   const ranges = [];

  //   for (let i = 0; i < 2; i++) {
  //     ranges.push(new vscode.Range(i, 0, i, 0)); // Position in the gutter
  //   }

  //   editor.setDecorations(decorationType, ranges);
  // }
  outputChannel = vscode.window.createOutputChannel("Regex Overlay", { log: true });
  log("Activating Regex Overlay extension");
  context.subscriptions.push(outputChannel);

  // let disposable = vscode.workspace.onDidOpenTextDocument((document) => {
  //   if (document.fileName.endsWith(".git")) {
  //     return; // Ignore .git files
  //   }
  //   updateOverlay(document);
  // });
  let disposable = vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (!editor || editor?.document.fileName.endsWith(".git")) {
      return; // Ignore .git files
    }
    updateOverlay(editor.document);
  });

  context.subscriptions.push(disposable);
  // Command to toggle debug mode
  const toggleDebugCommand = vscode.commands.registerCommand("regexOverlay.toggleDebug", () => {
    debugMode = !debugMode;
    vscode.window.showInformationMessage(`Debug mode is now ${debugMode ? "ON" : "OFF"}`);
  });

  context.subscriptions.push(toggleDebugCommand);

  const helloWorldCommand = vscode.commands.registerCommand("regex-overlay.helloWorld", () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage("bla2 bla!");
  });

  context.subscriptions.push(helloWorldCommand);

  // Initial update for the active editor
  if (vscode.window.activeTextEditor) {
    updateOverlay(vscode.window.activeTextEditor.document);
  }

  log("Regex Overlay extension activated");
}

function updateOverlay(document: vscode.TextDocument) {
  log(`Updating overlay for file: ${document.fileName}`);

  //   const config = vscode.workspace.getConfiguration("regexOverlay");
  //   const selectorConfigs: SelectorConfig[] = config.get("selectorConfigs", []);

  const selectorConfigs: SelectorConfig[] = [
    // {
    //   fileSelector: "\\.js$", // Targets JavaScript files with .js extension
    //   textSelector: "(features|report_types):\\s*\\[\\s*(['\"](.*?)['\"],?\\s*)*\\]", // Matches content inside console.log()
    // },
    {
      fileSelector: "\\.js$", // Targets JavaScript files with .js extension
      textSelector: "report_types:\\s*\\[\\s*(['\"](.*?)['\"],?\\s*)*\\]", // Matches content inside console.log()
    },
    {
      fileSelector: "\\.js$", // Targets JavaScript files with .js extension
      textSelector: "features:\\s*\\[\\s*(['\"](.*?)['\"],?\\s*)*\\]", // Matches content inside console.log()
    },
  ];
  const matchingConfigs = selectorConfigs.filter((config) => {
    const fileRegex = new RegExp(config.fileSelector);
    return fileRegex.test(document.fileName);
  });

  log(`Matching file selectors: ${matchingConfigs.length}`);

  if (matchingConfigs.length === 0) {
    log("No matching selectors found");
    return;
  }

  const allMatches: string[] = [];

  matchingConfigs.forEach((config) => {
    log("\n\n--------------------");
    log(`Matching fileSelector: ${config.fileSelector}`);
    const textRegex = new RegExp(config.textSelector, "gmi");
    const fileContent = document.getText();
    log(`file content: ${fileContent}`);
    log(`Matching textSelector: ${config.textSelector} || ${textRegex}`);
    const matches = fileContent.match(textRegex);
    log(`Matches`);
    log(matches as any);
    if (matches) {
      allMatches.push(...matches);
    }
  });

  log(`Total matches found: ${allMatches.length}`);

  if (allMatches.length > 0) {
    updateDecorations(document, allMatches);
    // showWebviewPanel(allMatches);
  }
}

function updateDecorations(document: vscode.TextDocument, matches: string[]) {
  // vscode.window.showInformationMessage(`🔍 : ${matches.join("\n")}\n`, { detail: "ok" });
  // vscode.window.createTextEditorDecorationType({

  // })
  const finalMatches = matches
    .map((m) => m.split("\n"))
    .flat()
    .map((e) => e.trim())
    .filter((e) => e);
  finalMatches.forEach((match, i) => {
    const decoration = vscode.window.createTextEditorDecorationType({
      before: {
        contentText: `🔍 : ${match}\t`,
        color: "#888888",
        margin: "0 0 20px 0",
      },
      isWholeLine: false,
    });
    const activeEditor = vscode.window.activeTextEditor;
    // const position = new vscode.Position(0, 0);
    const range = new vscode.Range(i, 0, i, 0);
    const canRender = activeEditor && activeEditor.document === document;
    console.log({ activeEditor, document, canRender });
    if (canRender) {
      activeEditor.setDecorations(decoration, [range]);
    }
  });
  // vscode.window.gu;

  // const targetEditor = vscode.window.activeTextEditor.find((e) => e.document === document);
  // const canRender = targetEditor && targetEditor.document === document;
  // console.log({ activeEditor, targetEditor, document, canRender });
  // if (targetEditor && targetEditor.document === document) {
  //   targetEditor.setDecorations(decoration, [range]);
  // }
}

export function deactivate() {
  log("Deactivating Regex Overlay extension");
}
