# File path to URI (an Obsidian.md plugin)

[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/MichalBures/obsidian-file-path-to-uri)](https://github.com/MichalBures/obsidian-file-path-to-uri/releases/latest)
[![GitHub All Releases](https://img.shields.io/github/downloads/MichalBures/obsidian-file-path-to-uri/total)](https://github.com/MichalBures/obsidian-file-path-to-uri/releases)

This plugin lets you convert a local path to a file url link that can be used to link to files or folders that are located outside of your Obsidian vault.

![demo](https://raw.githubusercontent.com/MichalBures/obsidian-file-path-to-uri/master/demo.gif)

## How to use this plugin

### Convert written path
1. Select the whole path you want to convert.
2. Use the default hotkey `Ctrl/Cmd + Alt + L` or press `Ctrl/Cmd + P` to open the command palette and search for `File path to URI: Toggle selected file path to URI and back`.
3. The selected path will toggle between file path and file url.

### Convert path from clipboard
1. Copy any path such as `C:\Users\Obsidian\Documents` or `\\network\folder\` to your clipboard
2. Use the default hotkey `Ctrl/Cmd + Alt + Shift + L` or press `Ctrl/Cmd + P` to open the command palette and search for `File path to URI: Paste file path as file uri`.
3. The converted path will be pasted into the editor (that is either `file:///C:/Users/Obsidian/Documents` or `file:///%5C%5Cnetwork/folder/` in this example)

### Convert path from clipboard to link

1. Copy any path such as `C:\Users\Obsidian\Documents` or `\\network\folder\` to your clipboard
2. Press `Ctrl/Cmd + P` to open the command palette and search
   for `File path to URI: Paste file path as file uri link`. There is no default hotkey for this command so if you want to use a keyboard shortcut you can set a custom one in Obsidian settings.
3. The converted path will be pasted into the editor (that is either `[C:\Users\Obsidian\Documents](file:///C:/Users/Obsidian/Documents)`
   or `[\\\\network\folder\](file:///%5C%5Cnetwork/folder/)` in this example)

## How to change the hotkey 

You can change the hotkey combination in Obsidian settings under Hotkeys. Look for `File path to URI: Toggle selected file path to URI and back` and `File path to URI: Paste file path as file uri`.

![hotkeys](https://raw.githubusercontent.com/MichalBures/obsidian-file-path-to-uri/master/hotkeys.png)

## Transforms

- `C:\Users\Obsidian\Documents` <-> `file:///C://Users//Obsidian//Documents`
- `\\network\folder\` <-> `file:///%5C%5Cnetwork/folder/`
- ` "C:\Users\Obsidian\Documents" ` -> `file:///C://Users//Obsidian//Documents`
  
    Strips the surrounding whitespace and double quotation marks from the selection

# Version History

## 1.0.0 (2021-01-17)
- Initial release

## 1.1.0 (2021-02-11)

- Add support for network paths and trim whitespace and quotation marks from selection

## 1.2.0 (2021-04-22)

- Add command to paste converted file path from clipboard as file uri

## 1.3.0 (2021-07-25)

- Add command to paste converted file path from clipboard as file uri link

## Credits

Code and readme inspired by [https://github.com/agathauy/wikilinks-to-mdlinks-obsidian](https://github.com/agathauy/wikilinks-to-mdlinks-obsidian)