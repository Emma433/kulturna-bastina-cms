const db = require('../config/db');

exports.index = async (req, res) => {
  try {
    const pretraga = req.query.q?.trim() || '';

    let sql = `
      SELECT *
      FROM obicaji
      WHERE status_objave = 1
    `;

    const params = [];

    if (pretraga) {
      sql += `
        AND (
          naziv LIKE ?
          OR kratki_opis LIKE ?
          OR detaljni_opis LIKE ?
        )
      `;

      const pojam = `%${pretraga}%`;

      params.push(
        pojam,
        pojam,
        pojam
      );
    }

    sql += `
      ORDER BY naziv ASC
    `;

    const [obicaji] = await db.query(
      sql,
      params
    );

    res.render('obicaji', {
      obicaji,
      pretraga,
    });
  } catch (error) {
    console.error(
      'Greška pri dohvaćanju običaja:',
      error.message
    );

    res.status(500).send(
      'Greška pri dohvaćanju običaja.'
    );
  }
};

exports.show = async (req, res) => {
  try {
    const { id } = req.params;

    const [obicaji] = await db.query(
      `SELECT *
       FROM obicaji
       WHERE id = ? AND status_objave = 1`,
      [id]
    );

    if (obicaji.length === 0) {
      return res.status(404).send('Običaj nije pronađen.');
    }

    const obicaj = obicaji[0];

    const [dogadanja] = await db.query(
      `SELECT *
       FROM dogadanja
       WHERE obicaj_id = ? AND status_objave = 1
       ORDER BY datum_pocetka ASC`,
      [id]
    );

    res.render('obicaj-detalji', {
      obicaj,
      dogadanja,
    });
  } catch (error) {
    console.error('Greška pri dohvaćanju detalja običaja:', error.message);
    res.status(500).send('Greška pri dohvaćanju običaja.');
  }
};