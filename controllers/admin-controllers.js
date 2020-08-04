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

exports.create = asyncWrapper(create);
