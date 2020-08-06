const express = require('express');
const sessionControllers = require('../controllers/session-controllers');
const { authMiddleware } = require('../middleware/auth');

const sessionRouter = express.Router();

sessionRouter.route('/login').post(sessionControllers.login);
sessionRouter.route('/login-team').post(sessionControllers.loginTeam);

sessionRouter.use(authMiddleware);

sessionRouter.route('/logout').delete(sessionControllers.logout);
sessionRouter.route('/logout-team').delete(sessionControllers.logoutTeam);

module.exports = sessionRouter;
