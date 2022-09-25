

const Page = require('./page');

/**
 * Main Page we land to after the succsefull login
 */
class MainPage extends Page {
    getMenuItem(menuItemName) {
        const item = $(`//*[contains(@class, 'oxd-main-menu-item')][contains(text(),'${menuItemName}')]/parent::a`);
        return item;
    }

    /**
     * define selectors using getter methods
     */
    get menuItemAdmin() { 
        return $("//aside[@class='oxd-sidepanel']//li[1]/a")
    }

    get loggedInName() {
        return $("//p[@class='oxd-userdropdown-name']");
    }

    get activeTabName() {
        return $("//span[@class='oxd-topbar-header-breadcrumb']/h6[1]").getText();
    }

    isLoggedIn() {
        return this.loggedInName.isDisplayed();
    }

    async navigateToAdminTab() {
        await this.menuItemAdmin.click();
    }
}

module.exports = new MainPage();

