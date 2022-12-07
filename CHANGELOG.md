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
