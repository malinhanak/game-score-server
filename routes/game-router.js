const express = require('express');
const gameControllers = require('../controllers/game-controllers');

const gameRouter = express.Router();

gameRouter.get('/', gameControllers.getGames);
gameRouter.post('/', gameControllers.create);
gameRouter.delete('/', gameControllers.remove);
gameRouter.post('/rules', gameControllers.createRules);
gameRouter.get('/rules/:slug', gameControllers.getRule);
gameRouter.patch('/rules/:slug', gameControllers.updateRule);

gameRouter.get('/:year', gameControllers.getGames);

module.exports = gameRouter;
