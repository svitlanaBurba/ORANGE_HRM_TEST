# ORANGE_HRM_TEST
## The purpose of the repository
The purpose of `ORANGE_HRM_TEST` repository is functional Javascript test automation of [orangehrm.com](https://opensource-demo.orangehrmlive.com/web/index.php/auth/login) by the following scenario:

1. Add your name Name Surname as ESS user role (click on Admin -> User Management -> Users -> click Add button)
2. Make sure he is displayed in the grid, it has User Role, Employer Name, Status (put the name [Username] field -> click on the Search button)
3. Click the Reset button and make sure your field appears in the grid
4. Select your field, click the Remove button and make sure your field is removed

## Test automation tools used:
Test automation is done by [WebdriverIO](https://webdriver.io/) 

## Project Setup 
1. Clone the repository ORANGE_HRM_TEST
2. Run the project dependencies with `npm i` or `nmp install`
3. `sample.env` file can be renamed to `.env` to put it to `.gitignore` and configure with environment variables provided below

## Environment
`TEST_ENV=test` - environment for tests execution

## Test suite running
1. Start IDE.
2. Open cloned project working environment.
3. Open terminal.
4. Run `npm run test` in terminal

