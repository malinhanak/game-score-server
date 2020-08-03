const bcrypt = require('bcryptjs');

const HttpError = require('../models/errors/HttpError');
const Team = require('../models/team');
const { asyncWrapper } = require('../utils/asyncWrapper');

async function create(req, res, next) {
  const { name, password } = req.body;
  const createTeam = new Team(req.body);

  await createTeam.save();
  const team = await Team.findOne({ name: name });

  if (team && team.comparePasswords(password)) {
    console.log('team and password is correct');
    req.session.team = team;

    res.status(200);
    return res.json({ name: name });
  }

  return next(new HttpError(`Lag namn eller lösenord är felaktigt!`));
}

async function setScore(req, res, next) {
  const name = req.body.name;
  const team = await Team.findOne({ name: name });

  if (!team) return next(new HttpError(`Kunde inte hitta laget`));

  const data = { [req.body.game]: req.body.points };

  await Team.updateOne({ name: req.body.name }, data);

  res.status(200);
  return res.json({ message: `${req.body.points} poäng lades till i ${req.body.game}.` });
}

async function getScore(req, res, next) {
  const team = await Team.findOne({ name: req.params.name });

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
