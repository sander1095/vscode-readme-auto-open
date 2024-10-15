import * as vscode from 'vscode';

const readmeStateKey = 'hasSeenReadme';

export async function activate(context: vscode.ExtensionContext) {
  console.log('Readme Auto Open: activated.');
  registerResetStateCommand(context);

  const hasSeenReadme = context.workspaceState.get<boolean>(readmeStateKey, false);

  if (hasSeenReadme) {
    console.log('Readme Auto Open: User has already seen the README.');
    return;
  }

  // We grab all the files in the root instead of using the glob-pattern to search for a README file.
  // The reason is that glob pattern searching doesn't support support case-insensitive search, so it's easier to use a regex instead.
  const allFilesInRootDirectory = await vscode.workspace.findFiles('*');

  // To prevent false positives when a PATH contains the word "readme" we only consider the file name.
  const allFileNamesWithUri = allFilesInRootDirectory.map(p => {
    const fileName = p.fsPath.split(/[\\/]/).pop();
    return { uri: p, fileName: fileName };
  });

  const readme = allFileNamesWithUri.find(file => file.fileName?.match(/^readme(\..+)?$/i));

  if (!readme || !readme.fileName) {
    console.log('README was not found.');
    return;
  }

  const readmeCanBePreviewed = readme.fileName.endsWith('.md');
  if (readmeCanBePreviewed) {
    console.log('Readme Auto Open: Attempting to open README in preview mode.');

    try {
      await vscode.commands.executeCommand('markdown.showPreview', readme);
    } catch (error) {
      console.error('Readme Auto Open: Error opening README in preview mode. It will be opened in the editor instead', error);
      await openReadmeInEditor(readme.uri);
    }
  } else {
    await openReadmeInEditor(readme.uri);
  }

  // Set the workspace state to indicate that the user has seen the README.
  await context.workspaceState.update(readmeStateKey, true);

  console.log(`Readme Auto Open: Opened ${readme.uri.fsPath}.`);
}

async function openReadmeInEditor(readme: vscode.Uri) {
  console.log('Readme Auto Open: Opening README in text editor.');
  await vscode.window.showTextDocument(readme);
}

function registerResetStateCommand(context: vscode.ExtensionContext) {
  // See package.json for command information
  const disposable = vscode.commands.registerCommand('readmeAutoOpen.resetState', async () => {
    await context.workspaceState.update(readmeStateKey, false);
    await vscode.window.showInformationMessage('Readme Auto Open state has been reset. Reload VSCode to see the README again.');
    console.log('Readme Auto Open: State has been reset.');
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
