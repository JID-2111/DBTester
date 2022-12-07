# DBTester

An application to unit test stored procedures inside databases.

Licenses under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)

[![Build Status][github-actions-status]][github-actions-url]
[![Github Tag][github-tag-image]][github-tag-url]

## Quick Links:

[Release Notes](#release-notes)
[Install Guide](#install-guide)
[Developing](#developing)
[FAQs](#frequently-asked-questions)
[License](#license)

# Release Notes

## Version 1.0.0

> [GitHub Release](https://github.com/JID-2111/JID-2111/releases/tag/v1.0.0)

### New Features

- Reworked the history page to show one row per execution rather than one row per unit test
- Generate output messages for the results of running a unit test
- New DB Tester logo on Windows and Mac
- Default text to the history page in the event no executions have ran
- Toolbar shortcuts for Mac
- User can delete executions on the history page
- User can upload test data in from a .csv file
- Added more detailed error messages for connection failures
- Refined sidebar UI on Home screen to match Execute screen

### Known Issues

- Filtering by connection name sometimes does not work
- Occasionally, a performed execution is not saved to the SQLite database
- The ‘view code’ option does not appear when loading in an execution

### Bug Fixes

- Execute button works as intended if user repeatedly clicks it
- Verified executions load on history page and all fields are populated
- Can connect to Azure databases with connection string using SSL
- Fixed Immer breaking in production app

## Version 0.4.0

> [GitHub Release](https://github.com/JID-2111/JID-2111/releases/tag/v0.4.0)

### New Features

- Revamped UI of entire Execute page to model modern database interface application
- Introduced Rule Groups to the UI, which can contain multiple Unit Tests
- Moved Results table to separate tab on Execute page
- Redesigned Results page to reflect Rule Groups
- User can select tables containing test data
- User can select tables that should be cleaned up after a test
- Built history page to view previous Executions
- Can search and filter by connection/status in the history table
- Previous executions can be re-loaded into the Execute workspace
- Added ability to toggle SSL in Connection Form order to connect to Azure databases

### Known Issues

- Cannot connect to Azure database via connection string (SSL does not work)
- Azure stored procedures are not populating as expected
- Sidebar styling on Home page does not match Execute page

### Bug Fixes

- Fixed form validation in Rule and Unit Test forms

## Version 0.3.0

> [GitHub Release](https://github.com/JID-2111/JID-2111/releases/tag/v0.3.0)

### New Features

- Ability to customize multiple unit tests to run on a database
- View outcome of executing multiple unit tests on the database
- Pass custom parameters to the procedure for testing
- All unit testing data is stored locally on execution

### Known Issues

- Running the unit tests multiple times results in inconsistent behavior
- You can add incomplete unit test conditions

### Bug Fixes

- Verified Postgres password behavior is intended

## Version 0.2.0

> [GitHub Release](https://github.com/JID-2111/JID-2111/releases/tag/v0.2.0)

### New Features

- Server Connections
- Connect to server manually
- View, edit, and select from recent connections list
- Ability to disconnect from a server
- Ability to switch databases within a server
- View procedure contents
- Reformatted and styled application
- Encrypt user credentials
- Support for file logging

### Bug Fixes

- Removed hard coded values
- Fixed infinite connection issue and moved to Database Pools

### Known Issues

- Password field is not being verified by PostgreSQL
- Had to disable front end unit tests due to Electron issues

## Version 0.1.0

### New Features

- Added support for connecting to a local Postgres database
- Added a user interface for connecting to a local database
- Added a dropdown to display all stored procedures from a local database

### Bug Fixes

- None

### Known Issues

- Pressing the connect button infinitely establishes a connection with the Postgres database
- Connection configuration is a hardcoded set of values

# Install Guide

## Pre-requisites

Since DBTester is a local application, all that is required is a computer running Windows or MacOS!

- For creating local database connections, [Postgres](https://www.postgresql.org/download/) may also be useful

## Download Instructions

1. Navigate to Releases in DBTester repository: (https://github.com/JID-2111/JID-2111/releases/latest)[https://github.com/JID-2111/JID-2111/releases/latest]
2. Each version will have a list of assets attached.
3. Download version corresponding to your OS (see [File Naming](#file-naming))

### File Naming

| **OS**      | **Name**           |
| ----------- | ------------------ |
| Mac-_Intel_ | DBTester-mac.dmg   |
| Mac-_Arm_   | DBTester.dmg       |
| Linux       | DBTester.AppImage  |
| Windows     | DBTester-Setup.exe |

## Build Instructions

Every time new code is merged to `main`, a new release is generated. This release can be located and downloaded as described in [Download Instructions](#download-instructions).

## Troubleshooting

If GitHub releases is not working, manual packaging can also be performed.

1. Open a local terminal
2. Clone git repository: `git clone https://github.com/JID-2111/JID-2111.git`
3. Navigate to folder where repository is stored
4. Run `npm run package`
5. After this finishes, run `cd release/build`
6. See [File Naming](#file-naming) to determine the correct file to open for your operating system.

After installing the app, you may also need to approve the app to run since it does not have a developer certificate:

1. Mac
   a. Find the application in your `Applications` folder
   b. Hold Ctrl while clicking the app
   c. Choose “Open” from the resulting popup.
2. Windows:
   a. A popup will show saying “Windows protected your PC”
   b. Click “More Info”
   c. Click “Run anyway”

# 🚀 Developing

## Pre-requisites

- Node.JS: [Bundled](https://nodejs.org/en/download/), [Homebrew](https://formulae.brew.sh/formula/node)

### VS Code Extensions

> Recommended extensions to use in VS Code

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) typescript formatting
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) Linting

_You can also just type @recommended in the extensions search bar_

[Husky](https://www.npmjs.com/package/husky) and [lint-staged](https://github.com/okonet/lint-staged) are enabled in this repo which means that prior to each commit, your code is checked for issues

## Starting Development

Install the necessary packages

```
npm install
```

Start the app

```
npm run start
```

Executing a single file

```
NODE_ENV=development npx ts-node filepath
```

Adding more modules

See documentation [here](https://electron-react-boilerplate.js.org/docs/adding-dependencies)

## Packaging for Production

> Building for current OS

```
npm run package
```

## Linting

> Making sure that code is written well and neatly

<br>

- `npm run lint` - runs ESLint and reports all linting errors without fixing them
- `npm run lint:fix` - runs ESLint and reports all linting errors, attempting to fix any auto-fixable ones
- `npm run format` - runs Prettier and automatically formats the entire codebase
- `npm run format:check` - runs Prettier and reports formatting errors without fixing them
- `npm run typecheck` - Quickly compile the code to check type errors

## IPC Renderer

In order to make sure your backend process can be used by files in `/renderer`, change these files:

```
src/main/ipc.ts
src/main/preload.ts
src/renderer/preload.d.ts
```

## Color Palette

- ![#f03c15](https://via.placeholder.com/15/131515ff/131515ff.png) `#131515ff: Eerie Black`
- ![#c5f015](https://via.placeholder.com/15/2b2c28ff/2b2c28ff.png) `#2b2c28ff: Jet`
- ![#1589F0](https://via.placeholder.com/15/339989ff/339989ff.png) `#339989ff: Persian Green`
- ![#1589F0](https://via.placeholder.com/15/7de2d1ff/7de2d1ff.png) `#7de2d1ff: Middle Blue Green`
- ![#1589F0](https://via.placeholder.com/15/fffafbff/fffafbff.png) `#fffafbff: Snow`
- ![#1589F0](https://via.placeholder.com/15/e4c3ad/e4c3ad.png) `#e4c3adff: Sand`

[github-actions-status]: https://github.com/JID-2111/JID-2111/workflows/CI/badge.svg
[github-actions-url]: https://github.com/JID-2111/JID-2111/actions
[github-tag-image]: https://img.shields.io/github/v/tag/JID-2111/JID-2111.svg?label=version&sort=semver
[github-tag-url]: https://github.com/JID-2111/JID-2111/releases/latest

# Frequently Asked Questions

## What is DBTester?

DBTester is a desktop application that allows users to test and debug their database stored procedures. It allows for seamless creation of connections to databases and access to procedures for testing.

## How do I connect to my local or remote database?

The New Connection button on the Home screen can be used to create a new connection to a database. This directs to a form where local database details are entered. You can also toggle to use connection strings instead for remote database connections.

## How do I select the stored procedure I would like to test?

Upon successful connection to a database, the app redirects to the Execute screen. On the left side of the screen, you will see the database you are connected to as well as a dropdown of the stored procedures associated with the database. Simply select the procedure you wish to test from the dropdown.

## What is a rule group and how do I create one?

A rule group corresponds to a single execution of the procedure. Therefore, each rule group should be given different parameters.
At the top of the Execute screen you will see a tab for Rule Groups. Clicking the tab, then `Add Rule Group`, allows you to:

- give your Rule Group a name
- define parameters to your stored procedure
- select a test data table or upload test data
- select tables to clean up after the execution (in case your procedure inserts data)

## What is a Unit Test and how do I create one?

In DBTester, a Unit Test is a condition that defines an expected state of a table in our database after a certain Rule Group is tested.
Upon connecting to a database, you will have the option to create Rule Groups and Unit Tests.
At the top of the Execute screen, you will see a tab for Unit Tests. Clicking the tab, then `Add Unit Tests`, allows you to:

- give your Unit Test a name
- select the table the Unit Test will assert.
- input results that are expected after the procedure runs
- assign the Unit Test to a Rule Group
  The Unit Test will look at the state of the provided table and compare to the expected results to return a Boolean `passed` or `failed` value.
  Note: you must define a Rule Group before creating a Unit Test.

## How do I execute and view the results of my Rule Groups and Unit Tests?

To the left on the Execute screen, there is a field that allows you to create an execution of your Rule Groups and Unit Tests. Simply give the Execution a name and click `Execute Tests`.
This redirects you to the Results Tab, where your Rule Groups and associated Unit Tests are grouped together in a dropdown. You can click on any dropdown to view individual results.

## Do I need to enter my database credentials each time I want to connect to my Database?

No. Recent connection information is saved locally and can be accessed via the home page sidebar or the Recent Connections page.
Note: you may need to restart the server to reconnect as well.

## Can I edit my connections once they have been created?

On the Recent Connections page, each connection has a pencil icon that allows you to change its nickname. Clicking the trash icon also deletes that connection from local storage.
Once a connection has been deleted, you will need to recreate the connection using the New Connection Form.

## How can I return to executions I have previously written?

On the Home page, clicking the `View History` button takes you to a table that displays a general overview of previous executions, including the procedure tested and the result of the test.
Here, you can filter by results or by database. You can also reopen an execution by clicking on its load button next to each result or delete it altogether by clicking on the trash can icon.
Note: deleting an execution cannot be undone.

# License

Copyright 2022 KPMG

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
