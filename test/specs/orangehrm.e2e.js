// Packages
const expect = require('expect').expect;

// configs
const { config } = require('../../wdio.conf');
const useTypes = require('../constants/userTypes.js');

// helpers
utils = require('../helpers/utils');

// pageObjects
const LoginPage = require('../pageobjects/LoginPage');
const MainPage = require('../pageobjects/MainPage');
const MainPageAdminTab = require('../pageobjects/MainPageAdminTab');
const MainPageAdminTabAddUser = require('../pageobjects/MainPageAdminTabAddUser');



describe('Login application, create and delete user', () => {
    let userData = {};


    it('Should login with valid credentials', async () => {
        await LoginPage.open();
        expect(await browser.getUrl()).toEqual(`${config.environmentUrl}web/index.php/auth/login`);

        console.log('Get displayed credentials');
        const credentials = await LoginPage.getCredentials();
        
        console.log('Login');
        await LoginPage.login(credentials);

        console.log('Should see Admin page');
        expect(await MainPage.isLoggedIn()).toBeTruthy();
    });

    it('Should navigate to admin tab / user management section ', async () => {
        console.log('Navigate to Admin tab');
        await MainPage.navigateToAdminTab();
        expect(await MainPage.activeTabName).toEqual('Admin');
        expect(await MainPageAdminTab.activeSectionName).toEqual('User Management');
    });

    it('Add your name Name Surname as ESS user role', async () => {
        console.log('Open Add User form');
        await MainPageAdminTab.openAddUserForm();
        // Check correct 'Add User' form is open
        expect(await MainPageAdminTab.activeAddFormTitle).toEqual('Add User');

        const employeeName = (await MainPage.loggedInName.getText());

        userData = {
            employeeName: employeeName,
            userRole: useTypes.UserRoleTypes['ESS'],
            userStatus: useTypes.UserStatusTypes['ENABLED'],
            userName: utils.generateUserName(),
            password: utils.generatePassword()
        }

        console.log('Fill New User Data');
        await MainPageAdminTabAddUser.fillAddUserForm(userData);
        console.log('Submit Form');
        await MainPageAdminTabAddUser.submitAddUserForm();        
        await MainPageAdminTab.waitAddFormClosed();
        // Check form is succesfully closed
        expect(await MainPageAdminTab.activeAddForm.isExisting()).toBeFalsy();
    });
 
    let foundUserRow;

    it('Newly added user role can be found and data is as provided', async () => {
        console.log('Lookup new user role by username');
        await MainPageAdminTab.lookupUserByUserName(userData.userName);

        console.log('Check that row for username is found');
        foundUserRow = await MainPageAdminTab.getUserGridRowByUserName(userData.userName);
        expect(await foundUserRow.isDisplayed()).toBeTruthy();
        
        console.log('Check that data is as it was provided');
        const foundUserData = await MainPageAdminTab.parseUserGridRow(foundUserRow);
        expect(foundUserData.employeeName).toEqual(userData.employeeName);
        expect(foundUserData.userStatus).toEqual(userData.userStatus);
        expect(foundUserData.userRole).toEqual(userData.userRole);
    });
    
    it('Click the Reset button and make sure your field appears in the grid', async () => {
        console.log('Click Reset and make sure grid have multiple records');
        await MainPageAdminTab.resetUserLookup();
        expect(await MainPageAdminTab.getNumOfUserGridRecords()).toBeGreaterThan(1);

        console.log('Check that row for username found');
        foundUserRow = await MainPageAdminTab.getUserGridRowByUserName(userData.userName, true);
        expect(await foundUserRow.isDisplayed()).toBeTruthy();
    });

    it('Select your field, click the Remove button and make sure your field is removed', async () => {
        console.log('Select record');
        await MainPageAdminTab.selectUserGridRow(foundUserRow);

        console.log('Click remove button');
        await MainPageAdminTab.deleteUserGridSelectedRows(foundUserRow);
        console.log('Confirm delete on modal');
        await MainPageAdminTab.confirmDelete();
   
        console.log('Check that record was deleted',userData.userName);
        await MainPageAdminTab.lookupUserByUserName(userData.userName);
        expect(await MainPageAdminTab.getNumOfUserGridRecords()).toEqual(0);



    });

});




