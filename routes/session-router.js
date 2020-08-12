const express = require('express');
const sessionControllers = require('../controllers/session-controllers');

const sessionRouter = express.Router();

sessionRouter.route('/login').post(sessionControllers.login);
sessionRouter.route('/login-team').post(sessionControllers.loginTeam);

module.exports = sessionRouter;
