const express = require('express');
const teamControllers = require('../controllers/team-controllers');
const { authMiddleware } = require('../middleware/auth');

const teamRouter = express.Router();

teamRouter.get('/', teamControllers.getTeams);
teamRouter.post('/', teamControllers.create);
teamRouter.get('/all-scores', teamControllers.getAllScores);

teamRouter.use(authMiddleware);

teamRouter.get('/get-score', teamControllers.getScore);
teamRouter.post('/', teamControllers.create);
teamRouter.post('/create-score', teamControllers.createScore);
teamRouter.patch('/set-score', teamControllers.setScore);

module.exports = teamRouter;
