const express = require('express');
const gameControllers = require('../controllers/game-controllers');

const gameRouter = express.Router();

gameRouter.route('/').post(gameControllers.create).delete(gameControllers.remove);

module.exports = gameRouter;
