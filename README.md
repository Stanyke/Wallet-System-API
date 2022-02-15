# Simple-User-API

This is a nodejs application (api) with expressjs and mySQL (for storage) thats used to manage user wallet system.

<h3> How to start the application</h3>

- Run _`yarn`_ or _`npm install`_ based on your own configuration on the root directory
- Create a .env file on root directory
- Add the _PORT_ environment variable to anything you wish to connect to.
- Add the _MySQLHOST_ environment variable to hold the host name of the MySQL database.
- Add the _MySQLUSER_ environment variable to hold the username of the MySQL database.
- Add the _MySQLPASSWORD_ environment variable to hold the password of the MySQL database.
- Add the _MySQLDB_ environment variable to hold the database name of the MySQL database.
- Add the _MySQLPORT_ environment variable to hold the port of the MySQL database.
- Add the _JWT_SECRET_ environment variable to hold the jwt secret key for auths.
- Start server using _npm run dev_

<b>API Documentation</b>
https://documenter.getpostman.com/view/12673071/UVkgxeom

<b>API Test (Using chai and mock data)</b>
- Run <b>npm run test</b> to run all tests for users api.

<h3><u>How to use the application</u></h3>
There are 5 apis/one sql file (for database migration) available and are being detailed below.

- Find the attached sql file in the root directory of this project, named `wallet_system_api.sql`
  - Create a databse on your sql server with name <b>_wallet_system_api_</b>
  - Import the sql file into the database

<hr/>

- {baseurl}/api/v1/users/register (POST)

  - This endpoint is used to register new user using, there are some required parameters which can be found in the Joi validator schema or API documentation.

- {baseurl}/api/v1/users/login (POST)

  - This endpoint is used to login a user, there are some required parameters which can be found in the Joi validator schema or API documentation.

- {baseurl}/api/v1/users/wallet/add-fund (POST)

  - This endpoint is used to add amount or fund the current logged in user's wallet account.

- {baseurl}/api/v1/users/wallet/transfer-fund (POST)

  - This endpoint is used to transfer funds from the current logged in user's wallet to another user, using their user id.

- {baseurl}/api/v1/users/wallet/withdraw-fund (POST)
  - This endpoint is used to withdraw funds from the current logged in user's wallet.
