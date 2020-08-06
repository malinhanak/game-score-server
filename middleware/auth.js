const jwt = require('jsonwebtoken');
const HttpError = require('../models/errors/HttpError');
const { asyncWrapper } = require('../utils/asyncWrapper');
const { SECRET_KEY } = process.env;

const authMiddleware = (req, res, next) => {
  if (!req.headers.authorization) return next(new HttpError('Authorization misslyckades', 401));
  const token = req.headers.authorization.split(' ')[1];
  if (!token) return next(new HttpError('Authorization misslyckades', 401));
  const decodedToken = jwt.verify(token, SECRET_KEY);
  req.user = {
    userId: decodedToken.id,
    username: decodedToken.username ? decodedToken.username : null,
    name: decodedToken.name
  };
  next();
};

exports.authMiddleware = asyncWrapper(authMiddleware);
