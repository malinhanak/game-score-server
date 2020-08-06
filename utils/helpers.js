exports.createGameArray = (games) => {
  return games.replace(/\s+/g, '').replace(/[ä]/g, 'a').replace(/[ö]/g, 'o').split(',');
};

exports.createScoreObject = (games) => {
  const map = games.map((key) => [key, 0]);
  return Object.fromEntries(map);
};

exports.createMemberArray = (members) => {
  return members.replace(/, /g, ',').split(',');
};

exports.sessionizeUser = (user) => {
  return { id: user._id, username: user.username ? user.username : null, name: user.name };
};

exports.mixedFieldCalc = (value, current, points) => {
  if (value) return current - points;
  return current + points;
};
