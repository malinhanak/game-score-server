require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const MongoDBStore = require('connect-mongodb-session')(session);

const HttpError = require('./models/errors/HttpError');
const Team = require('./models/team');
const Admin = require('./models/admin');
const teamRouter = require('./routes/team-router');
const sessionRouter = require('./routes/session-router');
const adminRouter = require('./routes/admin-router');
const gameRouter = require('./routes/game-router');
const db = require('./db');
const { PORT, DB_URI, SESS_NAME, SESS_SECRET, ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASS } = process.env;
corsOptions = {
  origin: ['https://my-game-kamp.web.app/', 'http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true
};

const app = express();

app.use(cors(corsOptions));

const store = new MongoDBStore({
  uri: DB_URI,
  collection: 'sessions'
});

app.use(bodyParser.json());

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });

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
  const team = await Team.findById(req.session.team.id);

  if (!team) return next(new HttpError(`Ingen matchande användare`, 404));

  req.team = team ? team : null;

  next();
});

app.use(async (req, res, next) => {
  if (!req.session.admin) return next();

  const admin = await Admin.findById(req.session.admin.id);

  if (!admin) return next(new HttpError(`Ingen matchande användare`, 404));

  req.admin = admin ? admin : null;
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
  console.log('ERROR', error);
  return (
    res.status(error.code).json({ message: error.message, error: error.errors }) ||
    res.status(500).res.json({ message: 'Något gick fel' })
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
