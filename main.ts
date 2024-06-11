import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	request,
} from "obsidian";

// Modal class to prompt the user for input
class InputModal extends Modal {
	plugin: MyPlugin;
	onSubmit: (string1: string, string2: string) => void;

	constructor(
		app: App,
		plugin: MyPlugin,
		onSubmit: (string1: string, string2: string) => void,
	) {
		super(app);
		this.plugin = plugin;
		this.onSubmit = onSubmit;
	}

	onOpen() {
		let { contentEl } = this;
		contentEl.empty();
		contentEl.createEl("h2", { text: "Enter Replacement Strings" });

		let string1 = "![[filename";
		let string2 = ".extension]]";

		new Setting(contentEl).setName("Prepend").addText((text) => {
			text.setPlaceholder("![[filename");
			text.onChange((value) => {
				string1 = value;
			});
		});

		new Setting(contentEl).setName("Append").addText((text) => {
			text.setPlaceholder(".extension]]");
			text.onChange((value) => {
				string2 = value;
			});
		});

		new Setting(contentEl).addButton((btn) =>
			btn
				.setButtonText("Submit")
				.setCta()
				.onClick(() => {
					this.onSubmit(string1, string2);
					this.close();
				}),
		);
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}

export default class MyPlugin extends Plugin {
	async onload() {
		// This creates an icon in the left ribbon.
		this.addRibbonIcon("replace", "Replace References", async () => {
			new InputModal(
				this.app,
				this,
				(string1: string, string2: string) => {
					let activeLeaf = this.app.workspace.activeLeaf;
					if (activeLeaf) {
						let view = activeLeaf.view as MarkdownView;
						let editor = view.sourceMode.cmEditor;
						let content = editor.getValue();
						content = this.replacePatterns(
							content,
							string1,
							string2,
						);
						editor.setValue(content);
						new Notice("Patterns replaced successfully!");
					}
				},
			).open();
		});
	}

	replacePatterns(content: string, string1: string, string2: string): string {
		// Define the regular expression patterns
		const singlePattern = /&(\d+)/g;
		const rangePattern = /&(\d+)-(\d+)/g;

		// Replace the range patterns first
		content = content.replace(rangePattern, (match, p1, p2) => {
			const start = parseInt(p1);
			const end = parseInt(p2);
			return Array.from(
				{ length: end - start + 1 },
				(_, i) => `${string1}${start + i - 1}${string2}`,
			).join("\n");
		});

		// Replace the single number patterns
		content = content.replace(singlePattern, (match, p1) => {
			return `${string1}${parseInt(p1) - 1}${string2}`;
		});

		return content;
	}

	onunload() {
		new Notice("Replace Patterns Plugin unloaded");
	}
}
