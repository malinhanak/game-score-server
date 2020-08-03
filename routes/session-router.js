const express = require('express');
const sessionControllers = require('../controllers/session-controllers');

const sessionRouter = express.Router();

sessionRouter.route('/login').post(sessionControllers.login);
sessionRouter.route('/logout').delete(sessionControllers.logout);

sessionRouter.route('/login-team').post(sessionControllers.loginTeam);
sessionRouter.route('/logout-team').delete(sessionControllers.logoutTeam);

module.exports = sessionRouter;
