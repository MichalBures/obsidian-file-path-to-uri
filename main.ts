import { Plugin, MarkdownView } from 'obsidian';
import { clipboard } from 'electron';
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

		this.addCommand({
			id: 'paste-file-path-as-file-uri',
			name: 'Paste file path as file uri',
			checkCallback: (checking: boolean) => {
				if (this.getEditor() === null) {
					return;
				}

				if (!checking) {
					this.pasteAsUri();
				}

				return true;
			},
			hotkeys: [
				{
					modifiers: ['Mod', 'Alt', 'Shift'],
					key: 'L',
				},
			],
		});


		this.addCommand({
			id: 'paste-file-path-as-file-uri-link',
			name: 'Paste file path as file uri link',
			checkCallback: (checking: boolean) => {
				if (this.getEditor() === null)
				{
					return;
				}

				if (!checking)
				{
					this.pasteAsUriLink();
				}

				return true;
			},
			hotkeys: [
				// For testing only
				// {
				// 	modifiers: ['Mod', 'Alt', 'Shift'],
				// 	key: 'J',
				// },
			],
		})
	}

	getEditor() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view || view.getMode() !== 'source') {
			return null;
		}

		return view.sourceMode.cmEditor;
	}

	pasteAsUri() {
		let editor = this.getEditor();
		if (editor == null) {
			return;
		}

		let clipboardText = clipboard.readText('clipboard');
		if (!clipboardText) {
			return;
		}

		clipboardText = this.cleanupText(clipboardText);

		// Paste the text as usual if it's not file path
		if (clipboardText.startsWith('file:') || !this.hasSlashes(clipboardText)) {
			editor.replaceSelection(clipboardText, 'around');
		}

		// network path '\\path'
		if (clipboardText.startsWith('\\\\')) {
			let endsWithSlash =
				clipboardText.endsWith('\\') || clipboardText.endsWith('/');
			// URL throws error on invalid url
			try {
				let url = new URL(clipboardText);

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
			if (!this.hasSlashes(clipboardText)) {
				return;
			}

			// URL throws error on invalid url
			try {
				let url = new URL('file://' + clipboardText);
				editor.replaceSelection(url.href, 'around');
			} catch (e) {
				return;
			}
		}
	}

	makeLink(title:string, link:string) {
		return `[${title}](${link})`
	}

	// TODO: todo
	pasteAsUriLink()
	{
		let editor = this.getEditor();
		if (editor == null)
		{
			return;
		}

		let clipboardText = clipboard.readText('clipboard');
		if (!clipboardText)
		{
			return;
		}

		clipboardText = this.cleanupText(clipboardText);

		// Paste the text as usual if it's not file path
		if (clipboardText.startsWith('file:') || !this.hasSlashes(clipboardText))
		{
			editor.replaceSelection(clipboardText, 'around');
		}

		// network path '\\path'
		if (clipboardText.startsWith('\\\\'))
		{
			let endsWithSlash =
				clipboardText.endsWith('\\') || clipboardText.endsWith('/');
			// URL throws error on invalid url
			try
			{
				let url = new URL(clipboardText);

				let link = url.href.replace('file://', 'file:///%5C%5C');
				if (link.endsWith('/') && !endsWithSlash)
				{
					link = link.slice(0, -1);
				}

				// Needs to add two '\\' (that is '\\\\' in code because of escaping) in order for the link title
				// to display two '\\' in preview mode
				editor.replaceSelection(this.makeLink('\\\\' + clipboardText, link), 'around');
			} catch (e)
			{
				return;
			}
		}
		// path C:\Users\ or \System\etc
		else
		{
			if (!this.hasSlashes(clipboardText))
			{
				return;
			}

			// URL throws error on invalid url
			try
			{
				let url = new URL('file://' + clipboardText);
				let trunc_url = /[^/]*$/.exec(clipboardText)[0]; // https://stackoverflow.com/questions/8376525/get-value-of-a-string-after-last-slash-in-javascript
				editor.replaceSelection(this.makeLink(trunc_url, url.href), 'around');
			} catch (e)
			{
				return;
			}
		}
	}


	/**
	 * Does the text have any '\' or '/'?
	 */
	hasSlashes(text: string) {
		// Does it have any '\' or '/'?
		const regexHasAnySlash = /.*([\\\/]).*/g;

		if (typeof text !== 'string') {
			return false;
		}

		let matches = text.match(regexHasAnySlash);
		return !!matches;
	}

	/**
	 * Trim whitespace and remove surrounding "
	 */
	cleanupText(text: string) {
		if (typeof text !== 'string') {
			return '';
		}

		text = text.trim();

		// Remove surrounding "
		if (text.startsWith('"')) {
			text = text.substr(1);
		}
		if (text.endsWith('"')) {
			text = text.substr(0, text.length - 1);
		}

		return text;
	}

	toggleLink() {
		let editor = this.getEditor();
		if (editor == null || !editor.somethingSelected()) {
			return;
		}

		let selectedText = editor.getSelection();
		selectedText = this.cleanupText(selectedText);

		// file url for network location file://\\location
		// Works for both 'file:///\\path' and 'file:///%5C%5Cpath'
		// Obsidian uses escape chars in link so `file:///\\location` will try to open `file:///\location instead
		// But the selected text we get contains the full string, thus the test for both 2 and 4 '\' chars
		if (
			selectedText.startsWith('file:///\\\\') ||
			selectedText.startsWith('file:///\\\\\\\\') ||
			selectedText.startsWith('file:///%5C%5C')
		) {
			// normalize to 'file:///'
			selectedText = selectedText.replace('file:///\\\\\\\\', 'file:///');
			selectedText = selectedText.replace('file:///\\\\', 'file:///');
			selectedText = selectedText.replace('file:///%5C%5C', 'file:///');

			let url = fileUriToPath(selectedText);

			if (url) {
				// fileUriToPath returns only single leading '\' so we need to add the second one
				editor.replaceSelection('\\' + url, 'around');
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
			let endsWithSlash =
				selectedText.endsWith('\\') || selectedText.endsWith('/');
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
			if (!this.hasSlashes(selectedText)) {
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
