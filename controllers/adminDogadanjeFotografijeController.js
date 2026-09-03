const fs = require('fs');
const path = require('path');
const db = require('../config/db');

exports.index = async (req, res) => {
  try {
    const { dogadanjeId } = req.params;

    const [dogadanja] = await db.query(
      `SELECT id, naziv
       FROM dogadanja
       WHERE id = ?`,
      [dogadanjeId]
    );

    if (dogadanja.length === 0) {
      return res.status(404).send(
        'Događanje nije pronađeno.'
      );
    }

    const [fotografije] = await db.query(
      `SELECT *
       FROM dogadanje_fotografije
       WHERE dogadanje_id = ?
       ORDER BY created_at DESC`,
      [dogadanjeId]
    );

    res.render(
      'admin/dogadanja/fotografije',
      {
        dogadanje: dogadanja[0],
        fotografije,
        korisnickoIme:
          req.session.adminKorisnickoIme,
      }
    );
  } catch (error) {
    console.error(
      'Greška pri dohvaćanju fotografija događanja:',
      error.message
    );

    res.status(500).send(
      'Došlo je do greške pri dohvaćanju fotografija.'
    );
  }
};

exports.create = async (req, res) => {
  try {
    const { dogadanjeId } = req.params;
    const { opis } = req.body;

    if (!req.file) {
      req.session.errorMessage =
        'Potrebno je odabrati fotografiju.';

      return res.redirect(
        `/admin/dogadanja/${dogadanjeId}/fotografije`
      );
    }

    const [dogadanja] = await db.query(
      `SELECT id
       FROM dogadanja
       WHERE id = ?`,
      [dogadanjeId]
    );

    if (dogadanja.length === 0) {
      return res.status(404).send(
        'Događanje nije pronađeno.'
      );
    }

    await db.query(
      `INSERT INTO dogadanje_fotografije (
        dogadanje_id,
        putanja,
        opis
      )
      VALUES (?, ?, ?)`,
      [
        dogadanjeId,
        req.file.filename,
        opis?.trim() || null
      ]
    );

    req.session.successMessage =
      'Fotografija je uspješno dodana.';

    res.redirect(
      `/admin/dogadanja/${dogadanjeId}/fotografije`
    );

  } catch (error) {

    console.error(
      'Greška pri dodavanju fotografije događanja:',
      error
    );

    res.status(500).send(
      'Došlo je do greške pri dodavanju fotografije.'
    );
  }
};

exports.delete = async (req, res) => {
  try {
    const { dogadanjeId, id } = req.params;

    const [fotografije] = await db.query(
      `SELECT putanja
       FROM dogadanje_fotografije
       WHERE id = ?
         AND dogadanje_id = ?`,
      [id, dogadanjeId]
    );

    if (fotografije.length === 0) {
      return res.status(404).send(
        'Fotografija nije pronađena.'
      );
    }

    const nazivDatoteke =
      fotografije[0].putanja;

    await db.query(
      `DELETE FROM dogadanje_fotografije
       WHERE id = ?
         AND dogadanje_id = ?`,
      [id, dogadanjeId]
    );

    const putanja = path.join(
      __dirname,
      '../public/images',
      nazivDatoteke
    );

    fs.unlink(putanja, (error) => {
      if (
        error &&
        error.code !== 'ENOENT'
      ) {
        console.error(
          'Greška pri brisanju fotografije:',
          error.message
        );
      }
    });

    req.session.successMessage =
      'Fotografija je uspješno obrisana.';

    res.redirect(
      `/admin/dogadanja/${dogadanjeId}/fotografije`
    );
  } catch (error) {
    console.error(
      'Greška pri brisanju fotografije događanja:',
      error.message
    );

    res.status(500).send(
      'Došlo je do greške pri brisanju fotografije.'
    );
  }
};