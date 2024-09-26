# Regex Overlay VSCode Extension Documentation

## Overview

**Regex Overlay** is a Visual Studio Code extension designed to help developers highlight specific patterns in their code using regular expressions. By applying file and text-based selectors, the extension scans active text editors in the workspace, searches for matching text, and visually highlights the results in the editor.


![**alt text**](https://github.com/akashraj9828/regex-overlay-extension/blob/main/screenshots/image.png?raw=true)

## Features

- **Regex-Based File Selection**: Specify which files to target using regular expressions.
- **Regex-Based Text Matching**: Search for patterns within targeted files.
- **Text Highlighting**: Overlay found matches with customizable decorations in the editor.
- **Debug Mode**: Toggle detailed logging to help track extension behavior.
- **Enable/Disable Commands**: Easily enable or disable the extension without restarting VSCode.
- **Custom Configuration**: Configure file and text matchers in the workspace settings.

## Commands

### `regex-overlay.check`
Displays a message to confirm that the extension is working correctly.

### `regex-overlay.toggleDebug`
Toggles debug mode on/off. When enabled, logs are written to the output channel for easier debugging.

### `regex-overlay.enable`
Enables the extension, allowing it to actively scan and highlight matches in the editor.

### `regex-overlay.disable`
Disables the extension, preventing it from scanning and highlighting.

## Configuration

You can configure the extension in your workspace's `settings.json` file under the `regexOverlay` section:

```json
{
  "regexOverlay": {
    "enabled": true,
    "selectorConfigs": [
      {
        "fileSelector": "\\.js$",
        "textSelector": "console.log(.*)"
      }
    ]
  }
}
```

- **enabled**: Enables or disables the extension.
- **selectorConfigs**: Array of objects that define:
  - `fileSelector`: Regex to match file types.
  - `textSelector`: Regex to match text patterns within the files.

## How It Works

1. **File Matching**: The extension first filters files based on the `fileSelector` regex.
2. **Text Matching**: Inside the matched files, the extension searches for patterns based on the `textSelector` regex.
3. **Decorating Matches**: Matches found are visually highlighted in the editor at the top of the file as an overlay that shows each match prefixed with a 🔍 symbol.

## Debug Mode

Enable debug mode to log detailed information such as matched files, found text, and the total number of matches. Use the `regex-overlay.toggleDebug` command to turn debug mode on or off. Logs are written to the "Regex Overlay" output channel.
---

This documentation covers the main aspects of the **Regex Overlay** extension. Users can extend its functionality by updating their regex patterns to match specific project needs.