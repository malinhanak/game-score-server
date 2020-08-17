const bcrypt = require('bcryptjs');

const HttpError = require('../models/errors/HttpError');
const Admin = require('../models/admin');
const { asyncWrapper } = require('../utils/asyncWrapper');

const create = async (req, res, next) => {
  const createAdmin = new Admin(req.body);
  await createAdmin.save();

  res.status(200);
  return res.json({ message: `Tävlingsledaren skapades!` });
};

const find = async (req, res, next) => {
  const admins = await Admin.find({});

  if (admins) {
    res.status(200);
    return res.json({
      admins: admins.map((score) => score.toObject({ getters: true }))
    });
  }

  return next(new HttpError(`Inga admins hittades`));
};

exports.create = asyncWrapper(create);
exports.find = asyncWrapper(find);
