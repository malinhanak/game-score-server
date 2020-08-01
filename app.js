require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const HttpError = require('./models/errors/HttpError');
const Team = require('./models/team');
const teamRouter = require('./routes/team-router');
const db = require('./db');

const app = express();

const store = new MongoDBStore({
  uri: process.env.MONGO_DB_URI,
  collection: 'sessions'
});

app.use(bodyParser.json());

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(
  session({
    secret: 'thisgameisveryserious',
    resave: false,
    saveUninitialized: false,
    store: store
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
  })
  .catch((err) => {
    console.error(`Connection error: ${err.stack} on Worker process: ${process.pid}`);
  });

module.exports = app;
