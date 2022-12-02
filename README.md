# Stored Procedure Unit Tester

An application to unit test stored procedures inside databases

Licenses under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)

[![Build Status][github-actions-status]][github-actions-url]
[![Github Tag][github-tag-image]][github-tag-url]

# Release Notes

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

# 🚀 Developing

## Pre requisites

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

## Docs

See boilerplate [docs and guides here](https://electron-react-boilerplate.js.org/docs/installation)

## IPC Renderer

In order to make sure your backend function can be used by the frontend, change these files:

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

# Frequenty Asked Questions (FAQ)

## What is DBTester?

DbTester is a desktop web application that allows users to test and debug their database stored procedures.
It allows for seemless creation of connections to databases and access to prodecures for testing.

## How do I connect to my local or remote database?

The New Connection button on the home screen can be used to create a new connection to a database.
This directs to a form where local database details are entered. You can also toggle to use connection
strings instead for remote database connections.

## How do I select the stored procedure I would like to test?

Upon successfull connection to a database, the app redirects to the Execute screen. On the left side of the
screen, You will see the database you are connected to as well as a dropdown of the stored procedures associated
with the database. Simply select the procedure you wish to test from the dropdown.

## What is a Rule Group and how do I create one?

A rule group is a overall definition of what you would like to test about your procedure.
At the top of the Execute screen you will see a tab for Rule group. Clicking the tab then Add Rule Group
allows you to:

- give your Rule Group a name
- define parameters to your stored procedure
- select the table to run your procedure on
- select table clean up

## What is a Unit Test and how do I create one?

A Unit Test is a condition that defines an expected behavior of a given stored prcedure based on the
Rule group paremeters and the nature of the stored procedure.
Upon connecting to a database, You will have the option to create Rule groups and Unit tests.
At the top of the Execute screen you will see a tab for Unit tests. Clicking the tab then Add Unit tests
allows you to:

- give your Unit test a name
- select the table the unit test will assert.
- input results that are expected after the procedure runs
- assign the unit test to a rule group
  The Unit test will look at the state of the affected table and compare to the expected results
  to return a Boolean true or false value.
  note: you must define a Rule Group before creating Unit Tests.

## How do I execute and view the results of my Rule groups and Unit Tests.

To the left on the Execute screen there is a field that allows you to create an execution of
your Rule Groups and Unit tests. Simply give the Ececution a name and click Execute Tests.
This brings you to the Results Tab where your Rule Groups are and associated Unit tests are
grouped together in a drop down. You can click on any dropdown to view individual results.

## Do I need to enter my database credientials each time I want to connect to my Database?

No. On the homepage lives a sidebar with your recently connected databases. Clicking on the
Database connection you would like to open will allow you to open the connection without filling
out a new connection form.
Alternatively, The Connect To Existing page is accessable from the home screen. This brings
up a list of recent connects. Clicking on the name will reopen your database connection.

## Can I edit my Connections once they have been created?

On the Connect To Existing page you will find next to each connection an edit button that allows
you to change the Nickname you gave your connection. As well as a delete button to delete connections.
Once a connection has been deleted, you will need to recreate the connection using the New Connection form.

## How can I return to tests I have prevoisly written?

On the Home page you will find the View History Button. This takes you to a table that displays your
a general overview of previouly run tests including the procedure tested and the result of the test.
Here you can filter by results or by database.
You can reopen executions by clicking on the arrow next to each result or you can also delete executions.
Note: deleting an execution can not be undone.
