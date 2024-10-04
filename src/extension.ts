import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    console.log('Readme Auto Open: activated.');

    // Check if the user has already seen the readme.md on a per workspace basis
    const hasSeenReadme = context.workspaceState.get<boolean>('hasSeenReadme', false);

    if (!hasSeenReadme) {
        const workspaceFolder = vscode.workspace.workspaceFolders![0].uri;
        const readmePatterns = ['readme.md', 'README.md', 'Readme.md'];

        readmePatterns.forEach(readmePattern => {
            const readmePath = vscode.Uri.joinPath(workspaceFolder, readmePattern);

            vscode.workspace.fs.stat(readmePath).then(
                () => {
                    // If the readme.md file exists, open it
                    vscode.commands.executeCommand('markdown.showPreview', readmePath);
                    // Set the flag to indicate that the user has seen the readme.md
                    context.workspaceState.update('hasSeenReadme', true);
                },
                () => {
                    // If the readme.md file does not exist, do nothing
                    console.log('readme.md file does not exist.');
                }
            );
        });
    }
}

// This method is called when your extension is deactivated
export function deactivate() { }
