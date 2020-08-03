const express = require('express');
const teamControllers = require('../controllers/team-controllers');

const teamRouter = express.Router();

teamRouter.route('/').get(teamControllers.getTeams).post(teamControllers.create);
teamRouter.route('/get-score/:name').get(teamControllers.getScore);

teamRouter.route('/set-score').patch(teamControllers.setScore);

module.exports = teamRouter;
