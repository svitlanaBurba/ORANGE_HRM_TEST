exports.getFormInputSelectorByLabel = function (label, inputType) {
  switch (inputType) {
    case 'select':
      return `//label[normalize-space()='${label}']/ancestor::
                div[contains(concat(' ',normalize-space(@class),' '),' oxd-input-group ')]
                //div[contains(@class,'oxd-select-wrapper')]`;
    default:
      return `//label[normalize-space()='${label}']/ancestor::
                *[contains(concat(' ',normalize-space(@class),' '),' oxd-input-group ')]
                //input`;
  }
};
