const HttpError = require('../models/errors/HttpError');
function asyncWrapper(callback) {
  return function (req, res, next) {
    return Promise.resolve(callback(req, res, next)).catch((err) =>
      next(new HttpError(err.message)),
    );
  };
}

exports.asyncWrapper = asyncWrapper;
