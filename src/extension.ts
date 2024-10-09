import * as vscode from 'vscode';

const readmeRegex = /readme(\..*)?/i;

export async function activate(context: vscode.ExtensionContext) {
    console.log('Readme Auto Open: activated.');

    // We grab all the files in the root instead of using the glob-pattern to search for a README file.
    // The reason is that glob pattern searching doesn't support support case-insensitive search, so it's easier to use a regex instead.
    const allFilesInRootDirectory = await vscode.workspace.findFiles('*');

    const readme = allFilesInRootDirectory.find(file => file.fsPath.match(readmeRegex));

    if (!readme) {
      console.log('README was not found.');
      return;
    }

    await vscode.window.showTextDocument(readme);

    console.log(`Readme Auto Open: Opened ${readme.fsPath}.`);
}

// This method is called when your extension is deactivated
export function deactivate() { }
