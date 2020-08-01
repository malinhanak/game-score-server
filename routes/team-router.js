const express = require('express');
const teamController = require('../controllers/team-controller');

const teamRouter = express.Router();

teamRouter.route('/').get(teamController.getTeams).post(teamController.create);
teamRouter.route('/get-score').get(teamController.getScore);

teamRouter.route('/set-score/:name').patch(teamController.setScore);

module.exports = teamRouter;
