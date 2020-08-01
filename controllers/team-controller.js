const bcrypt = require('bcryptjs');

const HttpError = require('../models/errors/HttpError');
const Team = require('../models/team');
const { asyncWrapper } = require('../utils/asyncWrapper');

async function create(req, res, next) {
  const alreadyExists = await Team.findOne({ name: req.body.name });

  if (alreadyExists) {
    return next(
      new HttpError(`Välj ett annat namn, ett lag med namnet ${req.body.name} finns redan.`)
    );
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const createTeam = new Team({ ...req.body, password: hashedPassword });
  await createTeam.save();

  const team = await Team.findOne({ name: req.body.name });

  console.log('team', team);

  if (!team) return next(new HttpError(`Laget finns inte!`));

  const isPassword = await bcrypt.compare(req.body.password, team.password);

  if (!isPassword) return next(new HttpError(`Ogiltigt lösenord`));

  req.session.isOnline = true;
  req.session.team = team;

  res.status(200);
  return res.json({ message: 'Laget är nu skapat och inloggat' });
}

async function setScore(req, res, next) {
  if (!req.team || req.session.team.name !== req.body.name) {
    return next(new AuthorizationError('Du saknar behörighet'));
  }
  const name = req.body.name;
  const team = await Team.findOne({ name: name });

  if (!team) return next(new HttpError(`Kunde inte hitta laget`));

  const data = { [req.body.game]: req.body.points };

  await Team.updateOne({ name: req.body.name }, data);

  res.status(200);
  return res.json({ message: `${req.body.points} poäng lades till i ${req.body.game}.` });
}

async function getScore(req, res, next) {
  if (!req.team || req.session.team.name !== req.body.name) {
    return next(new HttpError('Du saknar behörighet'));
  }

  const team = await Team.findOne({ name: req.team.name });

  if (!team) return next(new HttpError(`Hittar inga lag`));

  const pointsArray = [];
  pointsArray.push(team.kubb);
  pointsArray.push(team.crocket);
  pointsArray.push(team.plockepin);
  pointsArray.push(team.arrowTarget);

  const calcPoints = pointsArray.reduce((a, b) => a + b, 0);

  res.status(200);
  return res.json({
    totalScore: calcPoints
  });
}

async function getTeams(req, res, next) {
  const teams = await Team.find({});

  if (!teams) return next(new HttpError(`Hittar inga lag`));

  res.status(200);
  return res.json({
    teams: teams.map((team) => team.toObject({ getters: true }))
  });
}

exports.create = asyncWrapper(create);
exports.setScore = asyncWrapper(setScore);
exports.getScore = asyncWrapper(getScore);
exports.getTeams = asyncWrapper(getTeams);
