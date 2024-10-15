# Release instructions

This extension is released on the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=sandertenbrinke.readme-auto-open). This document contains the release process

❗ This will [need to be automated](https://github.com/sander1095/vscode-readme-auto-open/issues/2) at some point, but for now it's a manual process.

```bash
# Install the Visual Studio Code Extension Manager
npm install -g @vscode/vsce

# Login to the Visual Studio Code Marketplace
# The PAT (Marketplace, Manage) can be created on Azure DevOps (https://dev.azure.com/stenbrinke/_usersSettings/tokens) and is stored in GitHub Secrets.
vsce login sandertenbrinke

# Package the extension
# This calls the vscode:prepublish script in package.json
vsce package

# Test the package
code --install-extension readme-auto-open-1.0.0.vsix

# Publish the package
# This can be done by uploading the .vsix file in the Visual Studio Code Marketplace (https://marketplace.visualstudio.com/manage/publishers/sandertenbrinke)
# Or by running the following command:
vsce publish
```
