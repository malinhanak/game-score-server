const bcrypt = require('bcryptjs');

const HttpError = require('../models/errors/HttpError');
const Team = require('../models/team');
const Admin = require('../models/admin');
const { asyncWrapper } = require('../utils/asyncWrapper');

const { SESS_NAME } = process.env;

const login = async (req, res, next) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username: username });

  if (admin && admin.comparePasswords(password)) {
    req.session.admin = admin;

    res.status(200);
    return res.json({ admin: username });
  }

  return next(new HttpError(`Användarnamn eller lösenord är felaktigt!`));
};

const loginTeam = async (req, res, next) => {
  const { name, password } = req.body;
  const team = await Team.findOne({ name: name });

  if (team && team.comparePasswords(password)) {
    req.session.team = team;

    res.status(200);
    return res.json({ team: name });
  }

  return next(new HttpError(`Lagnamn eller lösenord är felaktigt!`));
};

const logout = async (req, res, next) => {
  const admin = req.session.admin;
  if (admin) {
    return session.destroy((err) => {
      if (err) return next(new HttpError(`Utloggningen misslyckades`));
      res.clearCookie(SESS_NAME);
      res.status(200);
      return res.json({ message: 'Utloggad', admin: admin.username });
    });
  }

  return next(new HttpError(`Du verkar inte ha någon aktiv admin session`));
};

const logoutTeam = async (req, res, next) => {
  const team = req.session.team;
  if (team) {
    return session.destroy((err) => {
      if (err) return next(new HttpError(`Utloggningen misslyckades`));
      res.clearCookie(SESS_NAME);
      res.status(200);
      return res.json({ message: 'Utloggad', team: team.name });
    });
  }

  return next(new HttpError(`Du verkar inte ha någon aktiv admin session`));
};

exports.login = asyncWrapper(login);
exports.loginTeam = asyncWrapper(loginTeam);
exports.logout = asyncWrapper(logout);
exports.logoutTeam = asyncWrapper(logoutTeam);