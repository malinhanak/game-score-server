const HttpError = require('../models/errors/HttpError');
const Team = require('../models/team');
const Admin = require('../models/admin');
const { asyncWrapper } = require('../utils/asyncWrapper');
const { sessionizeUser } = require('../utils/helpers');

const { SESS_NAME } = process.env;

const login = async (req, res, next) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username: username });

  if (!admin && !admin.comparePasswords(password)) {
    return next(new HttpError(`Användarnamn eller lösenord är felaktigt!`));
  }
  req.session.admin = sessionizeUser(admin);
  req.session.save((err) => {
    if (err) return next(new HttpError('Något gick fel'));
  });
  res.status(200);
  return res.json({ admin: username });
};

const loginTeam = async (req, res, next) => {
  const { name, password } = req.body;
  const team = await Team.findOne({ name: name });

  if (!team && !team.comparePasswords(password)) {
    return next(new HttpError(`Lagnamn eller lösenord är felaktigt!`));
  }

  req.session.team = sessionizeUser(team);
  req.session.save((err) => {
    if (err) return next(new HttpError('Något gick fel'));
  });
  res.status(200);
  return res.json({ team: name });
};

const logout = async (req, res, next) => {
  if (!req.session.admin) {
    return next(new HttpError(`Du verkar inte ha någon aktiv inloggning som admin`));
  }

  if (req.session.team && req.session.admin) {
    req.session.admin = null;
    req.session.save((err) => {
      if (err) return next(new HttpError('Något gick fel'));
    });
    res.status(200);
    return res.json({ message: 'Admin utloggad' });
  }

  return req.session.destroy((err) => {
    if (err) return next(new HttpError(`Utloggningen misslyckades`));
    res.clearCookie(SESS_NAME);
    res.status(200);
    return res.json({ message: 'Utloggad' });
  });
};

const logoutTeam = async (req, res, next) => {
  if (!req.session.team) {
    return next(new HttpError(`Du verkar inte ha någon aktiv team inloggning`));
  }

  if (req.session.admin && req.session.team) {
    req.session.team = null;
    req.session.save((err) => {
      if (err) return next(new HttpError('Något gick fel'));
    });
    res.status(200);
    return res.json({ message: 'Team utloggad' });
  }

  return req.session.destroy((err) => {
    if (err) return next(new HttpError(`Utloggningen misslyckades`));
    res.clearCookie(SESS_NAME);
    res.status(200);
    return res.json({ message: 'Utloggad' });
  });
};

exports.login = asyncWrapper(login);
exports.loginTeam = asyncWrapper(loginTeam);
exports.logout = asyncWrapper(logout);
exports.logoutTeam = asyncWrapper(logoutTeam);
