const expect = require('expect').expect;
const {config} = require('../../wdio.conf');
const useTypes = require('../constants/userTypes.js');
const utils = require('../helpers/utils');
const LoginPage = require('../pageobjects/LoginPage');
const MainPage = require('../pageobjects/MainPage');
const MainPageAdminTab = require('../pageobjects/MainPageAdminTab');
const MainPageAdminTabAddUser = require('../pageobjects/MainPageAdminTabAddUser');

describe('Login application, create and delete user', () => {
  it('Should login with valid credentials', async () => {
    await LoginPage.open();
    expect(await browser.getUrl()).toEqual(
      `${config.environmentUrl}web/index.php/auth/login`
    );

    const credentials = await LoginPage.getCredentials();
    await LoginPage.login(credentials);
    expect(await MainPage.isLoggedIn()).toBeTruthy();
  });

  it('Should navigate to admin tab / user management section ', async () => {
    await MainPage.navigateToAdminTab();
    expect(await MainPage.activeTabName).toEqual('Admin');
    expect(await MainPageAdminTab.activeSectionName).toEqual('User Management');
  });

  let userData = {};
  it('Add your name Name Surname as ESS user role', async () => {
    await MainPageAdminTab.openAddUserForm();
    expect(await MainPageAdminTab.activeAddFormTitle).toEqual('Add User');

    const employeeName = await MainPage.loggedInName.getText();
    userData = {
      employeeName: employeeName,
      userRole: useTypes.UserRoleTypes['ESS'],
      userStatus: useTypes.UserStatusTypes['ENABLED'],
      userName: utils.generateUserName(),
      password: utils.generatePassword()
    };
    await MainPageAdminTabAddUser.fillAddUserForm(userData);
    await MainPageAdminTabAddUser.submitAddUserForm();
    await MainPageAdminTab.waitAddFormClosed();
    expect(await MainPageAdminTab.activeAddForm.isExisting()).toBeFalsy();
  });

  let foundUserRow;
  it('Newly added user role can be found and data is as provided', async () => {
    await MainPageAdminTab.lookupUserByUserName(userData.userName);
    foundUserRow = await MainPageAdminTab.getUserGridRowByUserName(
      userData.userName
    );
    expect(await foundUserRow.isDisplayed()).toBeTruthy();

    const foundUserData = await MainPageAdminTab.parseUserGridRow(foundUserRow);
    expect(foundUserData.employeeName).toEqual(userData.employeeName);
    expect(foundUserData.userStatus).toEqual(userData.userStatus);
    expect(foundUserData.userRole).toEqual(userData.userRole);
  });

  it('Click the Reset button and make sure your field appears in the grid', async () => {
    await MainPageAdminTab.resetUserLookup();
    expect(await MainPageAdminTab.getNumOfUserGridRecords()).toBeGreaterThan(1);

    foundUserRow = await MainPageAdminTab.getUserGridRowByUserName(
      userData.userName,
      true
    );
    expect(await foundUserRow.isDisplayed()).toBeTruthy();
  });

  it('Select your field, click the Remove button and make sure your field is removed', async () => {
    await MainPageAdminTab.selectUserGridRow(foundUserRow);
    await MainPageAdminTab.deleteUserGridSelectedRows(foundUserRow);
    await MainPageAdminTab.confirmDelete();
    await MainPageAdminTab.lookupUserByUserName(userData.userName);
    expect(await MainPageAdminTab.getNumOfUserGridRecords()).toEqual(0);
  });
});
