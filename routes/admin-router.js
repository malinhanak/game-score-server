const express = require('express');
const adminControllers = require('../controllers/admin-controllers');

const adminRouter = express.Router();

adminRouter.route('/').post(adminControllers.create);

module.exports = adminRouter;
