const db = require('../config/db');

/**
 * Prikazuje popis budućih i prošlih događanja.
 */
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


/**
 * Prikazuje detalje pojedinog događanja.
 */
exports.show = async (req, res) => {
  try {
    const { id } = req.params;

    const [dogadanja] = await db.query(
      `SELECT
          dogadanja.id,
          dogadanja.naziv,
          dogadanja.opis,
          dogadanja.datum_pocetka,
          dogadanja.datum_zavrsetka,
          dogadanja.lokacija,
          dogadanja.naslovna_slika,
          dogadanja.obicaj_id,
          obicaji.naziv AS naziv_obicaja
       FROM dogadanja
       INNER JOIN obicaji
         ON dogadanja.obicaj_id = obicaji.id
       WHERE dogadanja.id = ?
         AND dogadanja.status_objave = 1`,
      [id]
    );

    if (dogadanja.length === 0) {
      return res.status(404).render('404', {
        title: 'Događanje nije pronađeno',
      });
    }

    const dogadanje = dogadanja[0];

    const [fotografije] = await db.query(
      `SELECT
          id,
          putanja,
          opis,
          created_at
       FROM dogadanje_fotografije
       WHERE dogadanje_id = ?
       ORDER BY created_at ASC`,
      [id]
    );

    res.render('dogadanje-detalji', {
      title: dogadanje.naziv,
      dogadanje,
      fotografije,
    });

  } catch (error) {
    console.error(
      'Greška pri dohvaćanju detalja događanja:',
      error.message
    );

    res.status(500).send(
      'Greška pri dohvaćanju detalja događanja.'
    );
  }
};