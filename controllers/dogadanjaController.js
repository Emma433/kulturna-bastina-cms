const db = require('../config/db');

exports.index = async (req, res) => {
  try {
    const [buducaDogadanja] = await db.query(
      `SELECT
          dogadanja.*,
          obicaji.naziv AS naziv_obicaja
       FROM dogadanja
       INNER JOIN obicaji
         ON dogadanja.obicaj_id = obicaji.id
       WHERE dogadanja.status_objave = 1
         AND dogadanja.datum_pocetka >= NOW()
       ORDER BY dogadanja.datum_pocetka ASC`
    );

    const [proslaDogadanja] = await db.query(
      `SELECT
          dogadanja.*,
          obicaji.naziv AS naziv_obicaja
       FROM dogadanja
       INNER JOIN obicaji
         ON dogadanja.obicaj_id = obicaji.id
       WHERE dogadanja.status_objave = 1
         AND dogadanja.datum_pocetka < NOW()
       ORDER BY dogadanja.datum_pocetka DESC`
    );

    res.render('dogadanja', {
      buducaDogadanja,
      proslaDogadanja,
    });
  } catch (error) {
    console.error(
      'Greška pri dohvaćanju događanja:',
      error.message
    );

    res.status(500).send(
      'Greška pri dohvaćanju događanja.'
    );
  }
};