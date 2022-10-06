exports.generateUserName = function (prefix = 'user') {
  const currDate = new Date();
  return `${prefix}${currDate.getTime().toString().substring(5, 100)}`;
};

exports.generatePassword = function (prefix = 'Pwd', postfix = '$') {
  const currDate = new Date();
  return `${prefix}${currDate
    .getTime()
    .toString()
    .substring(5, 100)}${postfix}`;
};
