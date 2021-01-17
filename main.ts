import { Plugin, MarkdownView } from 'obsidian';
import fileUriToPath from 'file-uri-to-path';

export default class FilePathToUri extends Plugin {
	async onload() {
		console.log('Loading plugin FilePathToUri...');

		this.addCommand({
			id: 'toggle-file-path-to-uri',
			name: 'Toggle selected file path to URI and back',
			checkCallback: (checking: boolean) => {
				if (this.getEditor() === null) {
					return;
				}

				if (!checking) {
					this.toggleLink();
				}

				return true;
			},
			hotkeys: [
				{
					modifiers: ['Mod', 'Alt'],
					key: 'L',
				},
			],
		});
	}

	getEditor() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView)
		if (!view || view.getMode() !== 'source') {
			return null
		}
		
		return view.sourceMode.cmEditor;
	}

	toggleLink() {
		let editor = this.getEditor();
		if (editor == null || !editor.somethingSelected()) {
			return;
		}

		// Does it have any '\' or '/'?
		const regexHasAnySlash = /.*([\\\/]).*/g;

		let selectedText = editor.getSelection();

		if (selectedText.startsWith('file://')) {
			let url = fileUriToPath(selectedText);
			if (url) {
				editor.replaceSelection(url, 'around');
			}
		} else {
			let matches = selectedText.match(regexHasAnySlash);
			if (!matches) {
				return;
			}

			// URL throws error on invalid url
			try {
				let url = new URL('file://' + selectedText);
				editor.replaceSelection(url.href, 'around');
			} catch (e) {
				return;
			}
		}
	}

	onunload() {
		console.log('Unloading plugin FilePathToUri...');
	}
}
