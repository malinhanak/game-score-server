const express = require('express');
const gameControllers = require('../controllers/game-controllers');

const gameRouter = express.Router();

gameRouter.post('/', gameControllers.create);
gameRouter.delete('/', gameControllers.remove);
gameRouter.get('/:year', gameControllers.getGames);

module.exports = gameRouter;
