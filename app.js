require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);

const HttpError = require('./models/errors/HttpError');
const Team = require('./models/team');
const Admin = require('./models/admin');
const teamRouter = require('./routes/team-router');
const db = require('./db');

const app = express();

const store = new MongoDBStore({
  uri: process.env.MONGO_DB_URI,
  collection: 'sessions',
  ttl: parseInt(process.env.SESS_LIFETIME) / 1000
});

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(
  session({
    secret: 'thisgameisveryserious',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      sameSite: true,
      maxAge: parseInt(process.env.SESS_LIFETIME)
    }
  })
);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(async (req, res, next) => {
  if (!req.session.team) return next();

  const team = await Team.findById(req.session.team._id);

  if (!team) {
    return next(new HttpError(`Kunde inte hitta användaren för session`, 404));
  }

  req.team = team;

  next();
});

app.use('/api/teams', teamRouter);

app.use((req, res, next) => {
  throw new HttpError('Kunde inte hitta vägen', 404);
});

app.use((error, req, res, next) => {
  return (
    res.status(error.code).json({ message: error.message, error: error.errors }) || res.status(500)
  );
});

db.connect()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log('App is running');
    });
    Admin.countDocuments({}, async (err, count) => {
      if (err) throw new Error(`Error in counting documents: ${err}`);
      if (count === 0) {
        console.log('No admins found, creating one...');
        const admin = new Admin({
          username: process.env.ADMIN_EMAIL,
          name: process.env.ADMIN_NAME,
          password: process.env.ADMIN_PASS,
          role: ['ADMIN']
        });
        await admin.save();
      }
    });
  })
  .catch((err) => {
    console.error(`Connection error: ${err.stack} on Worker process: ${process.pid}`);
    console.error(err);
  });

module.exports = app;
