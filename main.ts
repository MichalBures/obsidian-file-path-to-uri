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
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view || view.getMode() !== 'source') {
			return null;
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
		selectedText = selectedText.trim();
		
		// Remove surrounding "s
		if (selectedText.startsWith('"')) {
			selectedText = selectedText.substr(1);
		}
		if (selectedText.endsWith('"')) {
			selectedText = selectedText.substr(0, selectedText.length - 1);
		}

		// file url for network location file://\\location
		// Works for both 'file:///\\path' and 'file:///%5C%5Cpath'
		// Obsidian uses escape chars in link so `file:///\\location` will try to open `file:///\location instead
		// But the selected text we get contains the full string, thus the test for both 2 and 4 '\' chars
		if (selectedText.startsWith('file:///\\\\') || selectedText.startsWith('file:///\\\\\\\\') || selectedText.startsWith('file:///%5C%5C')) {
			// normalize to 'file:///'
			selectedText = selectedText.replace('file:///\\\\\\\\', 'file:///')
			selectedText = selectedText.replace('file:///\\\\', 'file:///')
			selectedText = selectedText.replace('file:///%5C%5C', 'file:///')
			
			let url = fileUriToPath(selectedText);
			
			if (url) {
				// fileUriToPath returns only single leading '\' so we need to add the second one
				editor.replaceSelection('\\'+url, 'around');
			}
		}
		// file link file:///C:/Users
		else if (selectedText.startsWith('file:///')) {
			let url = fileUriToPath(selectedText);
			
			if (url) {
				editor.replaceSelection(url, 'around');
			}
		}
		// network path '\\path'
		else if (selectedText.startsWith('\\\\')) {
			let endsWithSlash = selectedText.endsWith('\\') || selectedText.endsWith('/')
			// URL throws error on invalid url
			try {
				let url = new URL(selectedText);
				
				let link = url.href.replace('file://', 'file:///%5C%5C');
				if (link.endsWith('/') && !endsWithSlash) {
					link = link.slice(0, -1);
				}
				
				editor.replaceSelection(link, 'around');
			} catch (e) {
				return;
			}
		}
		// path C:\Users\ or \System\etc
		else {
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
