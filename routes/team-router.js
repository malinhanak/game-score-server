const express = require('express');
const teamControllers = require('../controllers/team-controllers');

const teamRouter = express.Router();

teamRouter.route('/').get(teamControllers.getTeams).post(teamControllers.create);
teamRouter.route('/create-score').post(teamControllers.createScore);
teamRouter.route('/set-score').patch(teamControllers.setScore);
teamRouter.route('/get-score/:team').get(teamControllers.getScore);
teamRouter.route('/all-scores').get(teamControllers.getAllScores);

module.exports = teamRouter;
