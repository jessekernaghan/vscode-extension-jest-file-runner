import * as vscode from 'vscode';

export class TerminalManager {
    private instance?: vscode.Terminal;

    constructor(private terminalName: string) {
        this.instance = this.hasInstance();
    }

    setupInstance() {
        this.instance = vscode.window.createTerminal(this.terminalName);
        vscode.window.onDidCloseTerminal((e) => {
            if(e.name === this.terminalName) {
                this.instance = undefined;
            }
        })
    }
    hasInstance() {
        return vscode.window.terminals.find(t => t.name === this.terminalName)
    }
    getInstance() {
        this.instance = this.hasInstance();
        if(!this.instance) { 
            this.setupInstance();
        }

        return this.instance;
    }
}