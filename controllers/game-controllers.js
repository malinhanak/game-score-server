const bcrypt = require('bcryptjs');

const HttpError = require('../models/errors/HttpError');
const Game = require('../models/game');
const Rule = require('../models/rule');
const { asyncWrapper } = require('../utils/asyncWrapper');
const { createGameArray, createSlug } = require('../utils/helpers');

const getGames = async (req, res, next) => {
  const game = await Game.find({});
  if (!game) return next(new HttpError(`Finns inga spel`));

  res.status(200);
  return res.json(game);
};

const getGame = async (req, res, next) => {
  const year = req.params.year;
  const game = await Game.findOne({ year: year });
  if (!game) return next(new HttpError(`Finns inga spel för ${year}`));

  res.status(200);
  return res.json(game.games);
};

const create = async (req, res, next) => {
  const { year, games } = req.body;
  const gameArray = createGameArray(games);
  const createGame = new Game({ year: year, games: gameArray });
  await createGame.save();

  res.status(200);
  return res.json({ message: `${year} års spelgrenar är tillagda.` });
};

const remove = async (req, res, next) => {
  if (!req.admin || !req.session.admin.role.includes('ADMIN')) {
    return next(new HttpError(`Du saknar behörighet`));
  }
  const { year } = req.body;
  const game = await Game.findOne({ year: year });

  if (game) {
    await game.deleteOne({ year: year });

    res.status(200);
    return res.json({ message: `År ${year}'s spelgrenar raderades` });
  }

  return next(new HttpError(`Finns inga spel registrerade för ${year}`));
};

const createRules = async (req, res, next) => {
  const { name } = req.body;
  const createRule = new Rule({ ...req.body, slug: createSlug(name) });
  await createRule.save();

  res.status(200);
  return res.json({ message: `Regler skapades för spelet ${name}` });
};

const getRule = async (req, res, next) => {
  const { slug } = req.params;
  const game = await Rule.findOne({ slug: slug });

  if (!game) return next(new HttpError('Hittade ingen regel', 404));

  res.status(200);
  return res.json({ rules: game.rules });
};

const updateRule = async (req, res, next) => {
  const { slug } = req.params;
  const { rules } = req.body;
  const game = await Rule.findOne({ slug: slug });
  if (!game)
    return next(new HttpError('Hittade ingen regel, försök skapa regler', 404));

  await Rule.updateOne({ slug: slug }, { rules: rules });

  res.status(200);
  return res.json({ message: `${game.name}'s regler har blivit uppdaterade` });
};

exports.create = asyncWrapper(create);
exports.remove = asyncWrapper(remove);
exports.getGames = asyncWrapper(getGames);
exports.getGame = asyncWrapper(getGame);
exports.createRules = asyncWrapper(createRules);
exports.getRule = asyncWrapper(getRule);
exports.updateRule = asyncWrapper(updateRule);
