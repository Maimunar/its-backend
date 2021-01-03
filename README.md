
*********************************************************************************************************************

# INTRODUCTION

This file is the backend for the ITS3 Project of Aleksandar Ivanov required by Fontys University of Applied Sciences.
The project uses a NodeJS Express API and a React Frontend and ressembles a band merch advertisement shop.


*********************************************************************************************************************

### CONSOLE COMMANDS

The following commands are available in the package.json:

"npm start" - start the application with nodemon

"npm test" - run the application tests

"npm run -s coverage" - check your code coverage


*********************************************************************************************************************

### Getting Started

Before starting this project, you need to make sure you have run 'npm install' in the console.

If you received this from Git, you might need to create a .env file in order to run it properly
Please include it in the src directory with the following lines:
PORT=<The port you want to run the server on>
DB_URL=<Your mongodb URL>
TOKEN_SECRET=<Your JWT secret>

The server runs on port 3000.

The server persists using a a mongoDB Database and the mongoose + mongodb packages

*********************************************************************************************************************

### TESTING AND CODE QUALITY

This project uses EditorConfig to standardize text editor configuration.
Visit http://editorconfig.org for details.

This project usese Mocha and Chai for testing.
Visit http://mochajs.org and http://chaijs.com for details;

To execute tests:
  npm test

Code coverage generated by http://instanbul.js.org

To calculate coverage:
npm run -s coverage

Additional Testing libraries that are used are proxyquire, sinon and sinon-chai

*********************************************************************************************************************

### API

This project uses Express for its API and Nodemon for its server

To run the API continuously:
npm start


*********************************************************************************************************************
