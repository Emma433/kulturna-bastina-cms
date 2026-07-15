const db = require('../config/db');

exports.index = async (req, res) => {
  try {
    const [obicaji] = await db.query(
      `SELECT *
       FROM obicaji
       WHERE status_objave = 1
       ORDER BY created_at DESC
       LIMIT 3`
    );

    const [dogadanja] = await db.query(
      `SELECT
          dogadanja.*,
          obicaji.naziv AS naziv_obicaja
       FROM dogadanja
       INNER JOIN obicaji
         ON dogadanja.obicaj_id = obicaji.id
       WHERE dogadanja.status_objave = 1
         AND dogadanja.datum_pocetka >= NOW()
       ORDER BY dogadanja.datum_pocetka ASC
       LIMIT 3`
    );

    res.render('index', {
      obicaji,
      dogadanja,
    });
  } catch (error) {
    console.error(
      'Greška pri dohvaćanju početne stranice:',
      error.message
    );

    res.status(500).send(
      'Došlo je do greške pri učitavanju početne stranice.'
    );
  }
};