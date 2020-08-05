const express = require('express');
var cors = require('cors');
const teamControllers = require('../controllers/team-controllers');

const teamRouter = express.Router();

teamRouter.route('/').get(teamControllers.getTeams).post(teamControllers.create);
teamRouter.route('/create-score').post(teamControllers.createScore);
teamRouter.route('/set-score').patch(cors(), teamControllers.setScore);
teamRouter.route('/get-score/:team').get(teamControllers.getScore);
teamRouter.route('/all-scores').get(teamControllers.getAllScores);

module.exports = teamRouter;
