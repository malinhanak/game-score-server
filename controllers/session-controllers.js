const jwt = require('jsonwebtoken');

const HttpError = require('../models/errors/HttpError');
const Team = require('../models/team');
const Admin = require('../models/admin');
const { asyncWrapper } = require('../utils/asyncWrapper');
const { sessionizeUser } = require('../utils/helpers');

const { SECRET_KEY } = process.env;

const login = async (req, res, next) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username: username });

  if (!admin && !admin.comparePasswords(password)) {
    return next(new HttpError(`Användarnamn eller lösenord är felaktigt!`));
  }
  const sessionUser = await sessionizeUser(admin);
  const token = jwt.sign({ ...sessionUser }, SECRET_KEY, { expiresIn: '8h' });
  res.status(200);
  return res.json({ ...sessionUser, token: token });
};

const loginTeam = async (req, res, next) => {
  const { name, password } = req.body;
  const team = await Team.findOne({ name: name });
  console.log('password', password);
  if (!team && !team.comparePasswords(password)) {
    return next(new HttpError(`Lagnamn eller lösenord är felaktigt!`));
  }

  const sessionUser = await sessionizeUser(team);
  const token = jwt.sign({ ...sessionUser }, SECRET_KEY, { expiresIn: '8h' });
  res.status(200);
  return res.json({ ...sessionUser, token: token });
};

const logout = async (req, res, next) => {
  res.status(200);
  return res.json({ message: 'Utloggad' });
};

const logoutTeam = async (req, res, next) => {
  res.status(200);
  return res.json({ message: 'Utloggad' });
};

exports.login = asyncWrapper(login);
exports.loginTeam = asyncWrapper(loginTeam);
exports.logout = asyncWrapper(logout);
exports.logoutTeam = asyncWrapper(logoutTeam);
