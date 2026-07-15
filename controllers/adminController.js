const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const db = require('../config/db');

exports.showLogin = (req, res) => {
  res.render('admin/login', {
    error: null,
  });
};

exports.login = async (req, res) => {
  try {
    const { korisnicko_ime, lozinka } = req.body;

    const [administratori] = await db.query(
      `SELECT *
       FROM administratori
       WHERE korisnicko_ime = ?`,
      [korisnicko_ime]
    );

    if (administratori.length === 0) {
      return res.status(401).render('admin/login', {
        error: 'Pogrešno korisničko ime ili lozinka.',
      });
    }

    const administrator = administratori[0];

    const lozinkaIspravna = await bcrypt.compare(
      lozinka,
      administrator.lozinka_hash
    );

    if (!lozinkaIspravna) {
      return res.status(401).render('admin/login', {
        error: 'Pogrešno korisničko ime ili lozinka.',
      });
    }

    req.session.adminId = administrator.id;
    req.session.adminKorisnickoIme = administrator.korisnicko_ime;


    req.session.successMessage = 'Uspješno ste se prijavili.';
    res.redirect('/admin');
  } catch (error) {
    console.error('Greška pri prijavi:', error.message);

    res.status(500).render('admin/login', {
      error: 'Došlo je do greške. Pokušajte ponovno.',
    });
  }
};

exports.dashboard = async (req, res) => {
  try {
    const [[obicajiStatistika]] = await db.query(
      `SELECT
        COUNT(*) AS ukupno_obicaja,
        SUM(CASE WHEN status_objave = 1 THEN 1 ELSE 0 END) AS objavljeni_obicaji
       FROM obicaji`
    );

    const [[dogadanjaStatistika]] = await db.query(
      `SELECT
        COUNT(*) AS ukupno_dogadanja,
        SUM(
          CASE
            WHEN status_objave = 1
              AND datum_pocetka >= NOW()
            THEN 1
            ELSE 0
          END
        ) AS buduca_dogadanja
       FROM dogadanja`
    );

    res.render('admin/dashboard', {
      korisnickoIme: req.session.adminKorisnickoIme,
      statistika: {
        ukupnoObicaja:
          Number(obicajiStatistika.ukupno_obicaja) || 0,

        objavljeniObicaji:
          Number(obicajiStatistika.objavljeni_obicaji) || 0,

        ukupnoDogadanja:
          Number(dogadanjaStatistika.ukupno_dogadanja) || 0,

        buducaDogadanja:
          Number(dogadanjaStatistika.buduca_dogadanja) || 0,
      },
    });
  } catch (error) {
    console.error(
      'Greška pri dohvaćanju statistike:',
      error.message
    );

    res.status(500).send(
      'Došlo je do greške pri učitavanju nadzorne ploče.'
    );
  }
};

exports.logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('Greška pri odjavi:', error.message);
      return res.status(500).send('Odjava nije uspjela.');
    }

    res.redirect('/admin/login');
  });
};

exports.listObicaji = async (req, res) => {
  try {
    const [obicaji] = await db.query(
      `SELECT *
       FROM obicaji
       ORDER BY created_at DESC`
    );

    res.render('admin/obicaji/index', {
      obicaji,
      korisnickoIme: req.session.adminKorisnickoIme,
    });
  } catch (error) {
    console.error('Greška pri dohvaćanju običaja:', error.message);
    res.status(500).send('Greška pri dohvaćanju običaja.');
  }
};

exports.showCreateObicaj = (req, res) => {
  res.render('admin/obicaji/create', {
    korisnickoIme: req.session.adminKorisnickoIme,
    error: null,
    formData: {},
  });
};

exports.createObicaj = async (req, res) => {
  try {
    const {
      naziv,
      kratki_opis,
      detaljni_opis,
      povijest,
      mjesto,
      organizator,
      status_objave,
    } = req.body;

    const naslovnaSlika = req.file
      ? req.file.filename
      : null;

    if (!naziv || !kratki_opis || !detaljni_opis) {
      return res.status(400).render('admin/obicaji/create', {
        korisnickoIme: req.session.adminKorisnickoIme,
        error: 'Naziv, kratki opis i detaljni opis obavezna su polja.',
        formData: req.body,
      });
    }

    await db.query(
      `INSERT INTO obicaji (
        naziv,
        kratki_opis,
        detaljni_opis,
        povijest,
        mjesto,
        organizator,
        naslovna_slika,
        status_objave
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        naziv.trim(),
        kratki_opis.trim(),
        detaljni_opis.trim(),
        povijest?.trim() || null,
        mjesto?.trim() || null,
        organizator?.trim() || null,
        naslovnaSlika,
        status_objave === '1' ? 1 : 0,
      ]
    );

    req.session.successMessage = 'Običaj je uspješno dodan.';
    res.redirect('/admin/obicaji');
  } catch (error) {
    console.error('Greška pri dodavanju običaja:', error.message);

    res.status(500).render('admin/obicaji/create', {
      korisnickoIme: req.session.adminKorisnickoIme,
      error: 'Došlo je do greške pri spremanju običaja.',
      formData: req.body,
    });
  }
};

exports.showEditObicaj = async (req, res) => {
  try {
    const { id } = req.params;

    const [obicaji] = await db.query(
      `SELECT *
       FROM obicaji
       WHERE id = ?`,
      [id]
    );

    if (obicaji.length === 0) {
      return res.status(404).send('Običaj nije pronađen.');
    }

    res.render('admin/obicaji/edit', {
      korisnickoIme: req.session.adminKorisnickoIme,
      error: null,
      obicaj: obicaji[0],
    });
  } catch (error) {
    console.error('Greška pri dohvaćanju običaja:', error.message);
    res.status(500).send('Greška pri dohvaćanju običaja.');
  }
};

exports.updateObicaj = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      naziv,
      kratki_opis,
      detaljni_opis,
      povijest,
      mjesto,
      organizator,
      status_objave,
    } = req.body;

    const [postojeciObicaji] = await db.query(
      `SELECT *
       FROM obicaji
       WHERE id = ?`,
      [id]
    );

    if (postojeciObicaji.length === 0) {
      return res.status(404).send('Običaj nije pronađen.');
    }

    const postojeciObicaj = postojeciObicaji[0];

    const naslovnaSlika = req.file
      ? req.file.filename
      : postojeciObicaj.naslovna_slika;

    if (!naziv || !kratki_opis || !detaljni_opis) {
      return res.status(400).render('admin/obicaji/edit', {
        korisnickoIme: req.session.adminKorisnickoIme,
        error: 'Naziv, kratki opis i detaljni opis obavezna su polja.',
        obicaj: {
          ...postojeciObicaj,
          ...req.body,
          id,
          naslovna_slika: naslovnaSlika,
          status_objave: status_objave === '1' ? 1 : 0,
        },
      });
    }

    const [result] = await db.query(
      `UPDATE obicaji
       SET
         naziv = ?,
         kratki_opis = ?,
         detaljni_opis = ?,
         povijest = ?,
         mjesto = ?,
         organizator = ?,
         naslovna_slika = ?,
         status_objave = ?
       WHERE id = ?`,
      [
        naziv.trim(),
        kratki_opis.trim(),
        detaljni_opis.trim(),
        povijest?.trim() || null,
        mjesto?.trim() || null,
        organizator?.trim() || null,
        naslovnaSlika,
        status_objave === '1' ? 1 : 0,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send('Običaj nije pronađen.');
    }

    req.session.successMessage = 'Običaj je uspješno ažuriran.';
    res.redirect('/admin/obicaji');
  } catch (error) {
    console.error('Greška pri uređivanju običaja:', error.message);
    res.status(500).send('Greška pri uređivanju običaja.');
  }
};

exports.deleteObicaj = async (req, res) => {
  try {
    const { id } = req.params;

    const [obicaji] = await db.query(
      `SELECT naslovna_slika
       FROM obicaji
       WHERE id = ?`,
      [id]
    );

    if (obicaji.length === 0) {
      return res.status(404).send('Običaj nije pronađen.');
    }

    const naslovnaSlika = obicaji[0].naslovna_slika;

    const [result] = await db.query(
      `DELETE FROM obicaji
       WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send('Običaj nije pronađen.');
    }

    if (naslovnaSlika) {
      const putanjaSlike = path.join(
        __dirname,
        '../public/images',
        naslovnaSlika
      );

      fs.unlink(putanjaSlike, (error) => {
        if (error && error.code !== 'ENOENT') {
          console.error(
            'Greška pri brisanju slike:',
            error.message
          );
        }
      });
    }


    req.session.successMessage = 'Običaj je uspješno obrisan.';
    res.redirect('/admin/obicaji');
  } catch (error) {
    console.error(
      'Greška pri brisanju običaja:',
      error.message
    );

    res.status(500).send(
      'Došlo je do greške pri brisanju običaja.'
    );
  }
};