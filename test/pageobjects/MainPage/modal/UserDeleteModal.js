

const Page = require('../../Page');

class UserDeleteModal extends Page {
    /**
     * define selectors using getter methods
     */
    get confirmDeleteBtn() { 
        return $("//button[normalize-space()='Yes, Delete']");
    }

    async isOpen() { 
        return await this.confirmDeleteBtn.isClickable();
    }

}

module.exports = new UserDeleteModal();

