require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./config/db');

const homeRoutes = require('./routes/homeRoutes');
const obicajiRoutes = require("./routes/obicajiRoutes");
const dogadanjaRoutes = require('./routes/dogadanjaRoutes');
const projektRoutes = require('./routes/projektRoutes');
const adminRoutes = require('./routes/adminRoutes');



const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));



app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

app.use((req, res, next) => {
  res.locals.successMessage = req.session.successMessage || null;
  res.locals.errorMessage = req.session.errorMessage || null;

  delete req.session.successMessage;
  delete req.session.errorMessage;

  next();
});

app.use('/', homeRoutes);
app.use('/obicaji', obicajiRoutes);
app.use('/dogadanja', dogadanjaRoutes);
app.use('/o-projektu', projektRoutes);
app.use('/admin', adminRoutes);




app.get('/test-baza', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, naziv FROM obicaji');

    res.json({
      poruka: 'Veza s bazom uspješno uspostavljena.',
      obicaji: rows,
    });
  } catch (error) {
    console.error('Greška pri povezivanju s bazom:', error.message);

    res.status(500).json({
      poruka: 'Povezivanje s bazom nije uspjelo.',
      greska: error.message,
    });
  }
});


app.use((req, res) => {
  res.status(404).render('404');
});


app.use((error, req, res, next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    req.session.errorMessage =
      'Slika je prevelika. Najveća dopuštena veličina je 5 MB.';

    return res.redirect(req.get('Referrer') || '/admin/obicaji');
  }

  if (
    error.message ===
    'Dopuštene su samo JPG, PNG i WEBP slike.'
  ) {
    req.session.errorMessage = error.message;

    return res.redirect(req.get('Referrer') || '/admin/obicaji');
  }

  console.error('Neočekivana greška:', error);

res.status(500).render('error');
});




app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});