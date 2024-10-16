import * as assert from 'assert';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import * as readmeAutoOpen from '../extension';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  let findFilesStub: sinon.SinonStub;
  let showTextDocumentStub: sinon.SinonStub;
  let executeCommandStub: sinon.SinonStub;
  let registerCommandStub: sinon.SinonStub;
  let context: vscode.ExtensionContext;

  setup(() => {
    context = {
      workspaceState: {
        get: sinon.stub().returns(false),
        update: sinon.stub().resolves()
      },
      subscriptions: []
    } as unknown as vscode.ExtensionContext;

    findFilesStub = sinon.stub(vscode.workspace, 'findFiles');
    showTextDocumentStub = sinon.stub(vscode.window, 'showTextDocument').resolves();
    executeCommandStub = sinon.stub(vscode.commands, 'executeCommand').resolves();
    registerCommandStub = sinon.stub(vscode.commands, 'registerCommand').callsFake((command, callback) => {
      if (command === 'readmeAutoOpen.resetState') {
        callback();
      }
      return { dispose: () => { } };
    });
  });

  teardown(() => {
    sinon.restore();
  });

  suite('Opening README files', () => {

    const markdownFiles = [
      vscode.Uri.file('README.md'),
      vscode.Uri.file('readme.MD'),
      vscode.Uri.file('reAdMe.mD'),
      vscode.Uri.file('reAdMe.test.md'),
    ];

    const nonMarkdownFiles = [
      vscode.Uri.file('README.txt'),
      vscode.Uri.file('README.pdf'),
      vscode.Uri.file('readme.zip.test'),
      vscode.Uri.file('readme.docx'),
      vscode.Uri.file('ReAdMe'),
      vscode.Uri.file('README'),
      vscode.Uri.file('readme'),
    ];

    markdownFiles.forEach((uri) => {
      test(`Markdown README file ${uri.fsPath} found and opened in preview mode`, async () => {
        // Arrange
        findFilesStub.resolves([uri]);

        // Act
        await readmeAutoOpen.activate(context);

        // Assert
        assert.strictEqual(executeCommandStub.calledWith('markdown.showPreview', uri), true);
        assert.strictEqual(showTextDocumentStub.called, false);
      });
    });

    nonMarkdownFiles.forEach((uri) => {
      test(`Non-markdown README file ${uri.fsPath} found and opened in editor`, async () => {
        // Arrange
        findFilesStub.resolves([uri]);

        // Act
        await readmeAutoOpen.activate(context);

        // Assert
        assert.strictEqual(executeCommandStub.called, false);
        assert.strictEqual(showTextDocumentStub.calledWith(uri), true);
      });
    });
  });

  suite('No README files found', () => {
    test('Nothing happens', async () => {
      // Arrange
      findFilesStub.resolves([]);

      // Act
      await readmeAutoOpen.activate(context);

      // Assert
      assert.strictEqual(executeCommandStub.called, false);
      assert.strictEqual(showTextDocumentStub.called, false);
    });
  });

  suite('Registering commands', () => {
    test('Reset command gets registered', async () => {
      // Arrange
      findFilesStub.resolves([]);

      // Act
      await readmeAutoOpen.activate(context);

      // Assert
      assert.strictEqual(registerCommandStub.calledWith('readmeAutoOpen.resetState'), true);
      sinon.assert.calledWith(context.workspaceState.update as sinon.SinonSpy, 'hasSeenReadme', false);
    });
  });
});
