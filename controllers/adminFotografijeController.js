const fs = require('fs');
const path = require('path');
const db = require('../config/db');

exports.index = async (req, res) => {
  try {
    const { obicajId } = req.params;

    const [obicaji] = await db.query(
      `SELECT id, naziv
       FROM obicaji
       WHERE id = ?`,
      [obicajId]
    );

    if (obicaji.length === 0) {
      return res.status(404).send('Običaj nije pronađen.');
    }

    const [fotografije] = await db.query(
      `SELECT *
       FROM fotografije
       WHERE obicaj_id = ?
       ORDER BY created_at DESC`,
      [obicajId]
    );

    res.render('admin/fotografije/index', {
      obicaj: obicaji[0],
      fotografije,
      korisnickoIme: req.session.adminKorisnickoIme,
    });
  } catch (error) {
    console.error(
      'Greška pri dohvaćanju fotografija:',
      error.message
    );

    res.status(500).send(
      'Došlo je do greške pri dohvaćanju fotografija.'
    );
  }
};

exports.create = async (req, res) => {
  try {
    const { obicajId } = req.params;
    const { opis } = req.body;

    if (!req.file) {
      req.session.errorMessage =
        'Potrebno je odabrati fotografiju.';

      return res.redirect(
        `/admin/obicaji/${obicajId}/fotografije`
      );
    }

    const [obicaji] = await db.query(
      `SELECT id
       FROM obicaji
       WHERE id = ?`,
      [obicajId]
    );

    if (obicaji.length === 0) {
      return res.status(404).send('Običaj nije pronađen.');
    }

    await db.query(
      `INSERT INTO fotografije (
        obicaj_id,
        naziv_datoteke,
        opis
      )
      VALUES (?, ?, ?)`,
      [
        obicajId,
        req.file.filename,
        opis?.trim() || null,
      ]
    );

    req.session.successMessage =
      'Fotografija je uspješno dodana.';

    res.redirect(
      `/admin/obicaji/${obicajId}/fotografije`
    );
  } catch (error) {
    console.error(
      'Greška pri dodavanju fotografije:',
      error.message
    );

    res.status(500).send(
      'Došlo je do greške pri dodavanju fotografije.'
    );
  }
};

exports.delete = async (req, res) => {
  try {
    const { obicajId, id } = req.params;

    const [fotografije] = await db.query(
      `SELECT naziv_datoteke
       FROM fotografije
       WHERE id = ? AND obicaj_id = ?`,
      [id, obicajId]
    );

    if (fotografije.length === 0) {
      return res.status(404).send(
        'Fotografija nije pronađena.'
      );
    }

    const nazivDatoteke =
      fotografije[0].naziv_datoteke;

    await db.query(
      `DELETE FROM fotografije
       WHERE id = ? AND obicaj_id = ?`,
      [id, obicajId]
    );

    const putanja = path.join(
      __dirname,
      '../public/images',
      nazivDatoteke
    );

    fs.unlink(putanja, (error) => {
      if (error && error.code !== 'ENOENT') {
        console.error(
          'Greška pri brisanju fotografije:',
          error.message
        );
      }
    });

    req.session.successMessage =
      'Fotografija je uspješno obrisana.';

    res.redirect(
      `/admin/obicaji/${obicajId}/fotografije`
    );
  } catch (error) {
    console.error(
      'Greška pri brisanju fotografije:',
      error.message
    );

    res.status(500).send(
      'Došlo je do greške pri brisanju fotografije.'
    );
  }
};