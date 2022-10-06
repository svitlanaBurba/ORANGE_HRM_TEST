const Page = require('./page');
const selectorHelper = require('../helpers/selectorHelper');

/**
 *
 */
class MainPageAdminTabAddUser extends Page {
  getFormInputSelectorByLabel(label, inputType) {
    switch (inputType) {
      case 'select':
        return `//label[normalize-space()='${label}']/ancestor::
        div[contains(concat(' ',normalize-space(@class),' '),' oxd-input-group ')]
        //div[contains(@class,'oxd-select-wrapper')]`;
      default:
        return `//label[normalize-space()='${label}']/ancestor::
        *[contains(concat(' ',normalize-space(@class),' '),' oxd-input-group ')]//input`;
    }
  }

  get employeeNameInput() {
    return $(
      selectorHelper.getFormInputSelectorByLabel('Employee Name', 'input')
    );
  }
  get userNameInput() {
    return $(selectorHelper.getFormInputSelectorByLabel('Username', 'input'));
  }
  get passwordInput() {
    return $(selectorHelper.getFormInputSelectorByLabel('Password', 'input'));
  }
  get passwordConfirmInput() {
    return $(
      selectorHelper.getFormInputSelectorByLabel('Confirm Password', 'input')
    );
  }
  get userRoleInput() {
    return $(selectorHelper.getFormInputSelectorByLabel('User Role', 'select'));
  }
  get userStatusInput() {
    return $(selectorHelper.getFormInputSelectorByLabel('Status', 'select'));
  }
  get saveBtn() {
    return $("//button[normalize-space()='Save']");
  }
  get formValidationError() {
    return $("//span[contains(@class,'oxd-input-field-error-message')]");
  }

  get dropList() {
    return $("//div[@role='option'][not(contains(.,'Searching'))]/parent::div");
  }

  async selectDropListValue(value, chooseFirstIfNoMatch) {
    let matchingOption = await this.dropList.$(
      `//*[@role='option'][normalize-space()='${value}']`
    );

    if (await matchingOption.isExisting()) {
      let choosenValue = await matchingOption.getText();
      await matchingOption.click();
      return choosenValue;
    } else if (chooseFirstIfNoMatch) {
      let firstOption = await this.dropList.$(`//*[@role='option']`);
      let choosenValue = await firstOption.getText();
      await firstOption.click();
      return choosenValue;
    } else {
      return null;
    }
  }

  async chooseEmployeeName(employeeName, chooseFirstIfNoMatch) {
    let lookupName = employeeName.trim().split(' ')[0];
    await this.employeeNameInput.waitForClickable();
    await this.employeeNameInput.setValue(lookupName);
    await this.dropList.waitForClickable();

    let choosenName = await this.selectDropListValue(
      employeeName,
      chooseFirstIfNoMatch
    );
    if (!choosenName) {
      throw new Error(`Employee ${employeeName} is not found!`);
    }
    return choosenName;
  }

  async chooseUserRole(userRole) {
    await this.userRoleInput.waitForClickable();
    await this.userRoleInput.click();
    await this.dropList.waitForClickable();

    let choosenRole = await this.selectDropListValue(userRole);
    if (!choosenRole) {
      throw new Error(`User Role ${userRole} is not found!`);
    }
    return choosenRole;
  }

  async chooseUserStatus(userStatus) {
    await this.userStatusInput.waitForClickable();
    await this.userStatusInput.click();
    await this.dropList.waitForClickable();

    let choosenStatus = await this.selectDropListValue(userStatus);
    if (!choosenStatus) {
      throw new Error(`User Status ${userStatus} is not found!`);
    }
    return choosenStatus;
  }

  async fillPassword(password) {
    await this.passwordInput.waitForClickable();
    await this.passwordInput.setValue(password);
  }

  async fillPasswordConfirm(password) {
    await this.passwordConfirmInput.waitForClickable();
    await this.passwordConfirmInput.setValue(password);
  }

  async fillUserName(userName) {
    await this.userNameInput.waitForClickable();
    await this.userNameInput.setValue(userName);
  }

  async fillAddUserForm(userData) {
    await this.chooseEmployeeName(userData.employeeName, true);
    await this.chooseUserRole(userData.userRole);
    await this.chooseUserStatus(userData.userStatus);
    await this.fillUserName(userData.userName);
    await this.fillPassword(userData.password);
    await this.fillPasswordConfirm(userData.password);

    await this.formValidationError.waitForExist({reverse: true, timeout: 2000});
  }

  async submitAddUserForm() {
    await this.saveBtn.waitForClickable();
    await this.saveBtn.click();
  }
}

module.exports = new MainPageAdminTabAddUser();
