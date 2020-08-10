const bcrypt = require('bcryptjs');

exports.createGameArray = (games) => {
  return games
    .replace(/\s+/g, '')
    .replace(/[ä]/g, 'a')
    .replace(/[ö]/g, 'o')
    .split(',');
};

exports.createScoreObject = (games) => {
  const map = games.map((key) => [key, 0]);
  return Object.fromEntries(map);
};

exports.createMemberArray = (members) => {
  return members.replace(/, /g, ',').split(',');
};

exports.sessionizeUser = (user) => {
  return {
    id: user._id,
    name: user.username ? user.username : user.name ? user.name : null,
    role: user.role ? user.role : null
  };
};

exports.mixedFieldCalc = (value, current, points) => {
  if (value) return current - points;
  return current + points;
};

exports.comparePasswords = async (password, encryptedPass) => {
  console.log('password', password);
  return await bcrypt.compare(password, encryptedPass);
};

exports.createSlug = (name) => {
  return name
    ? name
        .trim()
        .replace(/[äåáà]/gim, 'a')
        .replace(/[ööôóò]/gim, 'o')
        .replace(/[èé]/gim, 'e')
        .replace(/\s/g, '-')
        .toLowerCase()
    : null;
};
