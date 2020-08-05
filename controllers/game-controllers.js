const bcrypt = require('bcryptjs');

const HttpError = require('../models/errors/HttpError');
const Game = require('../models/game');
const { asyncWrapper } = require('../utils/asyncWrapper');
const { createGameArray } = require('../utils/helpers');

const create = async (req, res, next) => {
  if (!req.admin || !req.session.admin.role.includes('ADMIN')) {
    return next(new HttpError(`Du saknar behörighet`));
  }
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

exports.create = asyncWrapper(create);
exports.remove = asyncWrapper(remove);
