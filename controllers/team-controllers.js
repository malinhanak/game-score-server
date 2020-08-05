const bcrypt = require('bcryptjs');

const HttpError = require('../models/errors/HttpError');
const Team = require('../models/team');
const Game = require('../models/game');
const Score = require('../models/score');
const { asyncWrapper } = require('../utils/asyncWrapper');
const { createScoreObject, createMemberArray } = require('../utils/helper');

const create = async (req, res, next) => {
  if (!req.admin || !req.admin.role.includes('ADMIN')) {
    return next(new HttpError(`Du saknar behörighet`));
  }
  const { year, name, password, team } = req.body;
  const members = await createMemberArray(team);

  // Create the actual team
  const createTeam = new Team({
    name: name,
    password: password,
    members: members
  });
  await createTeam.save();

  // Create the initial score for the team
  const game = await Game.find({ year: year });
  if (game.length < 1) return next(new HttpError(`Laget skapades, men kunde inte skapa poäng`));

  const initialScore = await createScoreObject(game[0].games);
  const createScore = new Score({ team: name, scoreTotal: 0, scores: initialScore });
  await createScore.save();

  res.status(200);
  return res.json({ message: `Lag ${name} skapades` });
};

const createScore = async (req, res, next) => {
  if (!req.admin || !req.admin.role.includes('ADMIN')) {
    return next(new HttpError(`Du saknar behörighet`));
  }
  const { name, year } = req.body;

  const team = await Team.findOne({ name: name });
  if (!team) return next(new HttpError(`Det finns inget team, skapa team först.`));

  const game = await Game.findOne({ year: year });
  if (game) {
    const initialScore = createScoreObject(game.games);
    const createScore = new Score({ team: name, scoreTotal: 0, scores: initialScore });
    await createScore.save();

    res.status(200);
    return res.json({ message: `Lag ${name} grund poäng skapades` });
  }

  return next(new HttpError(`Hittar inte ett spel för år ${year}, skapa ett spel först.`));
};

const setScore = async (req, res, next) => {
  if (!req.team || req.team.name !== req.body.name) {
    return next(new HttpError(`Du saknar behörighet`));
  }
  const { name, game, points } = req.body;
  const score = await Score.findOne({ team: name });
  const parsedPoints = parseInt(points, 10);

  if (score) {
    score.scores = { ...score.scores, [game]: parsedPoints };
    score.markModified('scores');
    await score.save();

    const newScore = parseInt(score.scoreTotal, 10) + parsedPoints;
    await Score.updateOne({ team: name }, { scoreTotal: newScore });

    res.status(200);
    return res.json({
      message: `${points} poäng lades till lag ${name} total poäng och för grenen ${game}.`
    });
  }

  return next(new HttpError(`Kunde inte hitta laget`));
};

const getScore = async (req, res, next) => {
  if (!req.team || !req.team.name !== req.body.name) {
    return next(new HttpError(`Du saknar behörighet`));
  }
  const { name } = req.body;
  const team = await Score.findOne({ team: name });

  if (team) {
    res.status(200);
    return res.json({ score: team.scoreTotal });
  }

  return next(new HttpError(`Hittar inga lag`));
};

const getAllScores = async (req, res, next) => {
  const scores = await Score.find({});

  if (scores) {
    res.status(200);
    return res.json({ scores: scores.map((score) => score.toObject({ getters: true })) });
  }

  return next(new HttpError(`Inga poängställningar hittades`));
};

const getTeams = async (req, res, next) => {
  const teams = await Team.find({});

  if (teams) {
    res.status(200);
    return res.json({
      teams: teams.map((team) => team.toObject({ getters: true }))
    });
  }

  return next(new HttpError(`Hittar inga lag`));
};

exports.create = asyncWrapper(create);
exports.createScore = asyncWrapper(createScore);
exports.setScore = asyncWrapper(setScore);
exports.getScore = asyncWrapper(getScore);
exports.getAllScores = asyncWrapper(getAllScores);
exports.getTeams = asyncWrapper(getTeams);
