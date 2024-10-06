import * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
    console.log('Readme Auto Open: activated.');

    // Check if the user has already seen the readme on a per workspace basis
    // A workspace is a collection of one or more folders opened in VS Code
    const hasSeenReadme = context.workspaceState.get<boolean>('hasSeenReadme', false);

    if (hasSeenReadme) {
        console.log('Readme Auto Open: readme has already been viewed.');
        return;
    }

    const readmePattern = '[Rr][Ee][Aa][Dd][Mm][Ee].*';

    // Find the readme file in the root of any workspace folder in the workspace
    const files = await vscode.workspace.findFiles(readmePattern);

    if (files.length <= 0) {
        // If the readme file does not exist, do nothing
        return console.log(readmePattern + ' file does not exist.');
    }

    files.forEach(async (readmePath) => {
        /*
        * If readme is in .md format, automatically open it in document preview mode.
        * Remark: only one preview can be opened at a time. Therefore, open .md previews if only one .md readme exists.
        */
        if (files.length === 1 && readmePath.fsPath.toLowerCase().endsWith('.md')) {
            await vscode.commands.executeCommand('markdown.showPreview', readmePath);
        } else {
            // Open any readme file found in the workspace with preview set to false. Otherwise, only the last readme file found will be opened.
            await vscode.window.showTextDocument(readmePath, { preview: false });
        }

        // Set the flag to indicate that the user has seen the readme
        context.workspaceState.update('hasSeenReadme', true);
        console.log('Readme Auto Open: ' + readmePath + ' opened.');
    });
}

// This method is called when your extension is deactivated
export function deactivate() { }
