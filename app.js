require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const HttpError = require('./models/errors/HttpError');
const Team = require('./models/team');
const Admin = require('./models/admin');
const teamRouter = require('./routes/team-router');
const sessionRouter = require('./routes/session-router');
const adminRouter = require('./routes/admin-router');
const gameRouter = require('./routes/game-router');
const db = require('./db');

const app = express();

const {
  PORT,
  DB_URI,
  SESS_LIFETIME,
  SESS_NAME,
  SESS_SECRET,
  ADMIN_EMAIL,
  ADMIN_NAME,
  ADMIN_PASS
} = process.env;

const store = new MongoDBStore({
  uri: DB_URI,
  collection: 'sessions'
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(
  session({
    name: SESS_NAME,
    secret: SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(async (req, res, next) => {
  if (!req.session.team) return next();
  console.log(req.session.team);
  const team = await Team.findById(req.session.team._id);

  if (!team) return next(new HttpError(`Ingen matchande användare`, 404));

  req.team = team;

  next();
});

app.use(async (req, res, next) => {
  console.log(req.session.admin);
  if (!req.session.admin) return next();

  const admin = await Admin.findById(req.session.admin._id);

  if (!admin) return next(new HttpError(`Ingen matchande användare`, 404));

  req.admin = admin;
  next();
});

app.use('/api/teams', teamRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/game', gameRouter);
app.use('/api/admin', adminRouter);

app.use((req, res, next) => {
  throw new HttpError('Sökvägen hittades inte', 404);
});

app.use((error, req, res, next) => {
  return (
    res.status(error.code).json({ message: error.message, error: error.errors }) || res.status(500)
  );
});

db.connect()
  .then(() => {
    app.listen(PORT || 4000, () => console.info('Applikationen startade'));
    Admin.countDocuments({}, async (err, count) => {
      if (err) throw new Error(`Fel uppstod i dokument beräknaren: ${err}`);
      if (count === 0) {
        console.log('Ingen Administratör hittades, skapar administratör...');
        const admin = new Admin({
          username: ADMIN_EMAIL,
          name: ADMIN_NAME,
          password: ADMIN_PASS,
          role: ['ADMIN']
        });
        await admin.save();
      }
    });
  })
  .catch((err) => {
    console.error('Fel uppstod', err);
  });

module.exports = app;
