# Jest File Runner - VSCode Extension

This is a simple extension that automates the work of setting up and running jest cli commands against individual files. It targets specific files or related files using the `--runTestsByPath` and `--findRelatedTests` options.

## Features

- Explorer menu item for running only a specific test
- Explorer menu item for running tests related to a specific file
- Command palette `Run Test File` allows selecting a test file to be run
- Command palette `Run Related Tests` allows selecting a file to run its related tests

## Requirements

This extension assumes you are a developer using jest, node, and npm by default. It can be configured for other use-cases but isn't focused on them.

## Extension Settings


This extension contributes the following settings:

* `jestFileRunner.testCommand`: The test command to run for targeting a specific test, expect the filename and path as the last argument. Defaults to `npm test -- --runTestsByPath`
* `jestFileRunner.relatedTestsCommand`: The test command to run for targeting a file's related tests, expect the filename and path as the last argument. Defaults to `npm test -- --findRelatedTests`
* `jestFileRunner.quietMode`: Hides VSCode popups when JestFileRunner commands are run, defaults to true.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of JestFileRunner


---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)


## Download Extension

Currently not pushed to the marketplace, but you can download the latest package here:
[jest-file-runner-0.0.1.vsix](./downloads/jest-file-runner-0.0.1.vsix)