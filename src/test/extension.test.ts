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

    findFilesStub = sinon.stub(vscode.workspace, 'findFiles').resolves([]);
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
    test('Markdown README found and opened in preview mode', async () => {
      // Arrange
      const readmeUri = vscode.Uri.file('README.md');
      findFilesStub.resolves([readmeUri]);

      // Act
      await readmeAutoOpen.activate(context);

      // Assert
      assert.strictEqual(executeCommandStub.calledWith('markdown.showPreview', readmeUri), true);
      assert.strictEqual(showTextDocumentStub.called, false);
    });

    test('README (non markdown) found and opened in editor', async () => {
      // Arrange
      const readmeUri = vscode.Uri.file('README.txt');
      findFilesStub.resolves([readmeUri]);

      // Act
      await readmeAutoOpen.activate(context);

      // Assert
      assert.strictEqual(executeCommandStub.called, false);
      assert.strictEqual(showTextDocumentStub.calledWith(readmeUri), true);
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

      // Act
      await readmeAutoOpen.activate(context);

      // Assert
      assert.strictEqual(registerCommandStub.calledWith('readmeAutoOpen.resetState'), true);
      sinon.assert.calledWith(context.workspaceState.update as sinon.SinonSpy, 'hasSeenReadme', false);
    });
  });
});
