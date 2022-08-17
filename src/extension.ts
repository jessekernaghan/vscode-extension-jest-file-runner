import * as vscode from 'vscode';
import * as path from 'path';
import { TerminalManager } from './TerminalManager';
import { resolve } from 'path';

export function activate(context: vscode.ExtensionContext) {
	const terminalManager = new TerminalManager('Jest File Runner');

	const getFileFromQuickOpen = async (): Promise<vscode.Uri | undefined> => {
		
		const file = await vscode.window.showOpenDialog({
			canSelectFiles: true,
			canSelectFolders: false,
			canSelectMany: false,
			title: 'Select a test file to run',
			openLabel: 'Run Test'
		});

		if(!file || !file.length) {
			return;
		}

		return file[0];
	};

	const runCommand = (command: string, uri: vscode.Uri, message?: string) => {
		const relativePath = vscode.workspace.asRelativePath(uri.fsPath);
		const config = vscode.workspace.getConfiguration('jestFileRunner');
		
		if(message && !config.get<boolean>("quietMode")) {
			vscode.window.showInformationMessage(message);
		}

		const terminal = terminalManager.getInstance();
		terminal?.show();
		terminal?.sendText(`${command} "${relativePath}"`);
	};

	const commandHandler = (
		handler: (config: vscode.WorkspaceConfiguration, uri: vscode.Uri) => void
	) => {
		return async (uri: vscode.Uri) => {
			const config = vscode.workspace.getConfiguration('jestFileRunner');
			let resolvedUri = uri;
			try {
				if(!(resolvedUri instanceof vscode.Uri) || !resolvedUri.path) {
					const fileUri = await getFileFromQuickOpen();
					if(!fileUri) {
						return;
					}
					resolvedUri = fileUri;
				}
				handler(config, uri);
			} catch(e) {
				vscode.window.showErrorMessage(
					`JestFileRunner Error: ${e instanceof Error ? e.message : 'Unknown error occurred'}`
				);
			}
		} 
	}

	const runTestFileCommand = commandHandler((config, uri) => {
		const command = config.get<string>('testCommand');
		if(!command) {
			throw new Error('No config found for JestFileRunner.testCommand, please check your settings.')
		}
		runCommand(command, uri, 'Running your test...')
	});

	const runRelatedTestsCommand = commandHandler((config, uri) => {
		const command = config.get<string>('relatedTestsCommand');
		const relativePath = vscode.workspace.asRelativePath(uri.fsPath);
		
		if(!command) {
			throw new Error('No config found for JestFileRunner.relatedTestsCommand, please check your settings.')
		}
		runCommand(command, uri, `Running tests related to ${relativePath}...`)
	});


	// const runTestCommand = (uri: vscode.Uri) => {
	// 	const relativePath = vscode.workspace.asRelativePath(uri.fsPath);
	// 	vscode.window.showInformationMessage('Running your test');

	// 	const terminal = terminalManager.getInstance();
	// 	const config = vscode.workspace.getConfiguration('jestFileRunner');

	// 	terminal?.show();
		
	// 	terminal?.sendText(`${config.get('testCommand')} "${relativePath}"`);
	// };

	// const runRelatedTestsCommand = (uri: vscode.Uri) => {
	// 	const relativePath = vscode.workspace.asRelativePath(uri.fsPath);
	// 	vscode.window.showInformationMessage(`Running tests related to ${relativePath}...`);

	// 	const terminal = terminalManager.getInstance();
	// 	const config = vscode.workspace.getConfiguration('jestFileRunner');

	// 	terminal?.show();
		
	// 	terminal?.sendText(`${config.get('relatedTestsCommand')} "${relativePath}"`);
	// }

	// let runTestFile = vscode.commands.registerCommand('jestFileRunner.runTestFile', async (uri:vscode.Uri) => {

	// 	try {
	// 		if(!(uri instanceof vscode.Uri) || !uri.path) {
	// 			await getFileFromQuickOpen();
	// 		} else {
	// 			runTestCommand(uri);
	// 		}
	// 	} catch(e) {
	// 		vscode.window.showErrorMessage(`JestFileRunner Error: ${e instanceof Error ? e.message : 'Unknown error occurred'}`)
	// 	}
		
	// });
	// let runRelatedTests = vscode.commands.registerCommand('jestFileRunner.runRelatedTests', async (uri:vscode.Uri) => {
	// 	try {
	// 		if(!(uri instanceof vscode.Uri) || !uri.path) {
	// 			await getFileFromQuickOpen();
	// 		} else {
	// 			runRelatedTestsCommand(uri);
	// 		}
	// 	} catch(e) {
	// 		vscode.window.showErrorMessage(`JestFileRunner Error: ${e instanceof Error ? e.message : 'Unknown error occurred'}`)
	// 	}
		
	// });

	context.subscriptions.push(
		vscode.commands.registerCommand('jestFileRunner.runTestFile', runTestFileCommand),
		vscode.commands.registerCommand('jestFileRunner.runRelatedTests', runRelatedTestsCommand)
	);
}

export function deactivate() {}
