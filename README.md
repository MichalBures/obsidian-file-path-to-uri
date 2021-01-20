# File path to URI (an Obsidian.md plugin)

[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/MichalBures/obsidian-file-path-to-uri)](https://github.com/MichalBures/obsidian-file-path-to-uri/releases/latest)
[![GitHub All Releases](https://img.shields.io/github/downloads/MichalBures/obsidian-file-path-to-uri/total)](https://github.com/MichalBures/obsidian-file-path-to-uri/releases)

This plugin lets you convert a local path to a file url link that can be used to link to files or folders that are located outside of your Obsidian vault.

![demo](https://raw.githubusercontent.com/MichalBures/obsidian-file-path-to-uri/master/demo.gif)

## How to use this plugin

1. Select the whole path you want to convert.
2. Use the hotkey `Ctrl/Cmd + Alt + L` or press `Ctrl/Cmd + P` to open the command palette and search for `File path to URI: Toggle selected file path to URI and back`.
3. The selected path will toggle between file path and file url.

## How to change the hotkey (in a hacky way)

In the root folder of your Obsidian vault there is an `.obsidian` folder. Open it and go to the plugin folder `.obsidian\plugins\obsidian-file-path-to-uri\`.

Now open the `main.js` file and search for `hotkeys`.

You should see something like this:

```js
hotkeys: [
    {
        modifiers: ['Mod', 'Alt'],
        key: 'L',
    },
],
```

Here you can change the hotkey combination to whatever fits your needs better.

Save the file after you're done and restart Obsidian.

**Keep in mind that you will need to do this every time this plugin has been updated**


## Roadmap

- **Add option to select custom hotkeys**
  
    I admit I haven't look very hard, but I don't think there is an easy way to add this right now without coding the whole thing by myself. When Obsidian adds hotkey chooser to their settings I'll happily use it. 

# Version History

## 1.0.0 (2021-01-17)
- Initial release


## Credits

Code and readme inspired by [https://github.com/agathauy/wikilinks-to-mdlinks-obsidian](https://github.com/agathauy/wikilinks-to-mdlinks-obsidian)