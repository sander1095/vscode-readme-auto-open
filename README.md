# README Auto Open: Help your team onboard!

A VSCode plug-in that automatically opens the project's README when you open a project for the first time, ensuring people read it. Once opened, this plug-in will not activate again until you reset the state.

![An image of a README](https://media.githubusercontent.com/media/sander1095/vscode-readme-auto-open/main/resources/readme-dark.png)

## Why should you use this?
A (good) README is critical for understanding how to use a project, and this extension ensures that it's the first thing people see when they open a project.

💡 Add this to your workspace's [recommended extensions](https://code.visualstudio.com/docs/editor/extension-marketplace#_workspace-recommended-extensions) to ensure all contributors will read the README!
## Features

- Automatically opens the README when you open a project for the first time.
  - This plug-in will case-insensitively look for a `README` file in the root of your project, with or without any file extension.
  - If the file is in markdown format (`.md`), it will open it in preview mode.
- You can reset the state of this plug-in so it will be re-opened next time you open your project by using the `Readme Auto Open: Reset State` command.

### 1.0.0

Initial release
