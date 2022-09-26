

const Page = require('./page');
const selectorHelper = require('../helpers/selectorHelper')

/**
 * 
 */
class MainPageAdminTab extends Page {
    
    UserDeleteModal = require('./MainPage/modal/UserDeleteModal');

    get activeSectionName() {
        return $("//span[@class='oxd-topbar-header-breadcrumb']/h6[2]").getText();
    }

    get addBtn() {
        return $("//button[normalize-space()='Add']")
    }

    get activeAddForm() {
        return $("//*[contains(@class,'orangehrm-main-title')]");
    }

    get activeAddFormTitle() {
        return this.activeAddForm.getText();
    }

    get lookupFormUserNameInput() {
        return $(selectorHelper.getFormInputSelectorByLabel('Username', 'input'));
    }

    get lookupFormSearchBtn() {
        return $('//button[normalize-space()="Search"]');
    }

    get lookupFormResetBtn() {
        return $('//button[normalize-space()="Reset"]');
    }

    get deleteSelectedBtn() {
        return $('//button[normalize-space()="Delete Selected"]');
    }

    get userGridData() {
        return $("//*[@role='table']//*[contains(@class,'oxd-table-body')]");
    }

    get userGridDataRows() {
        return $$("//*[@role='table']//*[contains(@class,'oxd-table-body')]//*[@role='row']");
    }


    async waitAddFormClosed() {
        await this.activeAddForm.waitForDisplayed({ timeout: 15000, reverse: true });
    }

    async openAddUserForm() {
        await this.addBtn.click();
        await this.activeAddForm.waitForDisplayed();
    }

    async lookupUserByUserName(username) { 
        await this.lookupFormUserNameInput.waitForClickable();
        await this.lookupFormUserNameInput.setValue(username);

        await this.lookupFormSearchBtn.waitForClickable();
        await this.lookupFormSearchBtn.click();
        // await this.userGridData.waitForClickable({timeout:5000});
    }

    async resetUserLookup() {
        await this.lookupFormResetBtn.waitForClickable();
        await this.lookupFormResetBtn.click();
        await this.userGridData.waitForClickable({timeout:5000});
    }

    async getNumOfUserGridRecords() {
        await this.userGridData.waitForDisplayed();
        let rows = await this.userGridDataRows;
        return rows.length;
    }


    
    async getUserGridNextPageBtn() {
        return $("//nav[@role='navigation'][@aria-label='Pagination Navigation']//li[last()]//*[contains(@class,'oxd-pagination-page-item--previous-next')]");
    }

    async getUserGridRowByUserName(userName, scrollAllPages = false) {
        const rowSelector = `//*[@role='cell'][normalize-space()='${userName}']/ancestor::*[@role='row']`;
        let foundRow;
        let paginationBtns =[];

        if (scrollAllPages) {
            // check if there are pagination buttons on the tab
            paginationBtns = await $$("//nav[@role='navigation'][@aria-label='Pagination Navigation']//button[normalize-space()]");
        }
        
        if (scrollAllPages && paginationBtns.length > 0) {
            // iterate over pagination buttons, click them all and look for a row until either found or no more pages left
            for (const btn of paginationBtns) {
                btn.click();
                this.userGridData.waitForDisplayed();
                foundRow = await this.userGridData.$(rowSelector);
                if (await foundRow.isDisplayed()) {
                    // stop iterating, record found
                    return foundRow;
                }
            }
        }
        else {
            foundRow = await this.userGridData.$(rowSelector);
        }

        return (foundRow.isDisplayed()) ? foundRow: null;
    }
    
    async selectUserGridRow(row) {
        const rowID = /type=\"checkbox\" value=\"(.*?)\"/gm.exec(await row.getHTML())[1];

        const selectCheckbox = await $(`//input[@value="${rowID}"]/parent::label`);
        console.log('Select btn', await selectCheckbox.getHTML());

        await selectCheckbox.click();
    }

    async deleteUserGridSelectedRows() {
        await this.deleteSelectedBtn.waitForClickable();
        await this.deleteSelectedBtn.click();
    }

    async confirmDelete() {        
        await this.UserDeleteModal.confirmDeleteBtn.waitForClickable();
        await this.UserDeleteModal.confirmDeleteBtn.click();
        await this.userGridData.waitForDisplayed({ timeout: 15000 })
    }

    async removeUserGridRow(row) {
        console.log('Deleting row', await row.getHTML());
        const removeBtn = await row.$("//i[contains(@class,'bi-trash')]/parent::button");
        console.log("//i[contains(@class,'bi-trash')]/parent::button");
        console.log('Delete btn', await removeBtn.getHTML());

        console.log('Deleting - click', this.deleteSelectedBtn);
        await this.deleteSelectedBtn.click();

        await this.UserDeleteModal.confirmDeleteBtn.waitForClickable();
        await this.UserDeleteModal.confirmDeleteBtn.click();
        await this.userGridData.waitForDisplayed({ timeout: 5000 })

    }

    async parseUserGridRow(row) {
        const cells = await row.$$("//*[@role='cell']");
        let rowData = [];
        for (const cell of cells) {
            rowData.push(await cell.getText());
        };

        const userData = {
            userName: rowData[1],
            userRole: rowData[2],
            userStatus: rowData[4],
            employeeName: rowData[3],
            row: row,
        }

        return userData;
    }


    async getUserGridData() {
        let gridData = [];
        let rows = await this.userGridDataRows;

        for (const row of rows) {
            let cells = await row.$$("//*[@role='cell']");
            let rowData = [];
            for (const cell of cells) {
                rowData.push(await cell.getText());
            };
            gridData.push(rowData);
        };

        return gridData;
    }


}

module.exports = new MainPageAdminTab();

