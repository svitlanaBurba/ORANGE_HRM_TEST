const Page = require('./Page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
  /**
   * define selectors using getter methods
   */
  get inputUsername() {
    return $('//input[@name="username"]');
  }

  get inputPassword() {
    return $('//input[@name="password"]');
  }

  get btnLogin() {
    return $('//button[normalize-space()="Login"]');
  }

  get credentialsTab() {
    return $(
      '/html[1]/body[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[2]/div[1]/div[1]'
    );
  }

  async getCredentials() {
    const credentialsText = await this.credentialsTab.getText();
    const credentialsRegex = /^Username : (\w+)\nPassword : (\w+)$/;
    const [, username, password] = credentialsText.match(credentialsRegex);
    if (!username || !password) {
      throw new Error('Credentials was not provided');
    }
    return {username, password};
  }

  /**
   * a method to encapsule automation code to interact with the page
   * e.g. to login using username and password
   */
  async login({username, password}) {
    await this.inputUsername.setValue(username);
    await this.inputPassword.setValue(password);
    await this.btnLogin.click();
  }

  /**
   * overwrite specific options to adapt it to page object
   */
  open() {
    return super.open('');
  }
}

module.exports = new LoginPage();
