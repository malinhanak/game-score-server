require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const HttpError = require('./models/errors/HttpError');
const Team = require('./models/team');
const Admin = require('./models/admin');
const teamRouter = require('./routes/team-router');
const sessionRouter = require('./routes/session-router');
const adminRouter = require('./routes/admin-router');
const gameRouter = require('./routes/game-router');
const db = require('./db');
const { PORT, ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASS } = process.env;

const corsOptions = {
  origin: ['https://my-game-kamp.web.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization'
  ],
  credentials: true
};

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.options('*', cors(corsOptions));
app.use('/api/admin', adminRouter);
app.use('/api/teams', teamRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/game', gameRouter);

app.use((req, res, next) => {
  throw new HttpError('Sökvägen hittades inte', 404);
});

app.use((error, req, res, next) => {
  console.log('ERROR', error);

  return (
    res
      .status(error.code)
      .json({ message: error.message, error: error.errors }) ||
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
