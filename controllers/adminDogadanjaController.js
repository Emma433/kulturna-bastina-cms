const db = require('../config/db');

/**
 * Prikazuje sva događanja u administratorskom dijelu.
 */
exports.index = async (req, res) => {
  try {
    const [dogadanja] = await db.query(
      `SELECT
          dogadanja.id,
          dogadanja.naziv,
          dogadanja.datum_pocetka,
          dogadanja.datum_zavrsetka,
          dogadanja.lokacija,
          dogadanja.status_objave,
          dogadanja.created_at,
          obicaji.naziv AS naziv_obicaja
       FROM dogadanja
       INNER JOIN obicaji
         ON dogadanja.obicaj_id = obicaji.id
       ORDER BY dogadanja.datum_pocetka DESC`
    );

    res.render('admin/dogadanja/index', {
      dogadanja,
      korisnickoIme: req.session.adminKorisnickoIme,
    });
  } catch (error) {
    console.error(
      'Greška pri dohvaćanju događanja:',
      error.message
    );

    res.status(500).send(
      'Došlo je do greške pri dohvaćanju događanja.'
    );
  }
};

/**
 * Prikazuje obrazac za dodavanje događanja.
 */
exports.showCreate = async (req, res) => {
  try {
    const [obicaji] = await db.query(
      `SELECT id, naziv
       FROM obicaji
       ORDER BY naziv ASC`
    );

    res.render('admin/dogadanja/create', {
      obicaji,
      korisnickoIme: req.session.adminKorisnickoIme,
      error: null,
      formData: {},
    });
  } catch (error) {
    console.error(
      'Greška pri pripremi obrasca događanja:',
      error.message
    );

    res.status(500).send(
      'Došlo je do greške pri otvaranju obrasca.'
    );
  }
};

/**
 * Sprema novo događanje u bazu.
 */
exports.create = async (req, res) => {
  try {
    const {
      obicaj_id,
      naziv,
      opis,
      datum_pocetka,
      datum_zavrsetka,
      lokacija,
      status_objave,
    } = req.body;

    if (
      !obicaj_id ||
      !naziv ||
      !datum_pocetka ||
      !lokacija
    ) {
      const [obicaji] = await db.query(
        `SELECT id, naziv
         FROM obicaji
         ORDER BY naziv ASC`
      );

      return res.status(400).render(
        'admin/dogadanja/create',
        {
          obicaji,
          korisnickoIme:
            req.session.adminKorisnickoIme,
          error:
            'Običaj, naziv, početak događanja i lokacija obavezna su polja.',
          formData: req.body,
        }
      );
    }

    if (
      datum_zavrsetka &&
      new Date(datum_zavrsetka) <
        new Date(datum_pocetka)
    ) {
      const [obicaji] = await db.query(
        `SELECT id, naziv
         FROM obicaji
         ORDER BY naziv ASC`
      );

      return res.status(400).render(
        'admin/dogadanja/create',
        {
          obicaji,
          korisnickoIme:
            req.session.adminKorisnickoIme,
          error:
            'Datum završetka ne može biti prije datuma početka.',
          formData: req.body,
        }
      );
    }

    const [povezaniObicaji] = await db.query(
      `SELECT id
       FROM obicaji
       WHERE id = ?`,
      [obicaj_id]
    );

    if (povezaniObicaji.length === 0) {
      return res.status(400).send(
        'Odabrani običaj ne postoji.'
      );
    }

    await db.query(
      `INSERT INTO dogadanja (
        obicaj_id,
        naziv,
        opis,
        datum_pocetka,
        datum_zavrsetka,
        lokacija,
        status_objave
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        Number(obicaj_id),
        naziv.trim(),
        opis?.trim() || null,
        datum_pocetka,
        datum_zavrsetka || null,
        lokacija.trim(),
        status_objave === '1' ? 1 : 0,
      ]
    );

    req.session.successMessage = 'Događanje je uspješno dodano.';
    res.redirect('/admin/dogadanja');
  } catch (error) {
    console.error(
      'Greška pri dodavanju događanja:',
      error.message
    );

    res.status(500).send(
      'Došlo je do greške pri spremanju događanja.'
    );
  }
};

/**
 * Prikazuje obrazac za uređivanje događanja.
 */
exports.showEdit = async (req, res) => {
  try {
    const { id } = req.params;

    const [dogadanja] = await db.query(
      `SELECT
          id,
          obicaj_id,
          naziv,
          opis,
          DATE_FORMAT(
            datum_pocetka,
            '%Y-%m-%dT%H:%i'
          ) AS datum_pocetka,
          DATE_FORMAT(
            datum_zavrsetka,
            '%Y-%m-%dT%H:%i'
          ) AS datum_zavrsetka,
          lokacija,
          status_objave
       FROM dogadanja
       WHERE id = ?`,
      [id]
    );

    if (dogadanja.length === 0) {
      return res.status(404).send(
        'Događanje nije pronađeno.'
      );
    }

    const [obicaji] = await db.query(
      `SELECT id, naziv
       FROM obicaji
       ORDER BY naziv ASC`
    );

    res.render('admin/dogadanja/edit', {
      dogadanje: dogadanja[0],
      obicaji,
      korisnickoIme:
        req.session.adminKorisnickoIme,
      error: null,
    });
  } catch (error) {
    console.error(
      'Greška pri dohvaćanju događanja:',
      error.message
    );

    res.status(500).send(
      'Došlo je do greške pri dohvaćanju događanja.'
    );
  }
};

/**
 * Sprema izmjene postojećeg događanja.
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      obicaj_id,
      naziv,
      opis,
      datum_pocetka,
      datum_zavrsetka,
      lokacija,
      status_objave,
    } = req.body;

    if (
      !obicaj_id ||
      !naziv ||
      !datum_pocetka ||
      !lokacija
    ) {
      const [obicaji] = await db.query(
        `SELECT id, naziv
         FROM obicaji
         ORDER BY naziv ASC`
      );

      return res.status(400).render(
        'admin/dogadanja/edit',
        {
          obicaji,
          korisnickoIme:
            req.session.adminKorisnickoIme,
          error:
            'Običaj, naziv, početak događanja i lokacija obavezna su polja.',
          dogadanje: {
            id,
            ...req.body,
            status_objave:
              status_objave === '1' ? 1 : 0,
          },
        }
      );
    }

    if (
      datum_zavrsetka &&
      new Date(datum_zavrsetka) <
        new Date(datum_pocetka)
    ) {
      const [obicaji] = await db.query(
        `SELECT id, naziv
         FROM obicaji
         ORDER BY naziv ASC`
      );

      return res.status(400).render(
        'admin/dogadanja/edit',
        {
          obicaji,
          korisnickoIme:
            req.session.adminKorisnickoIme,
          error:
            'Datum završetka ne može biti prije datuma početka.',
          dogadanje: {
            id,
            ...req.body,
            status_objave:
              status_objave === '1' ? 1 : 0,
          },
        }
      );
    }

    const [result] = await db.query(
      `UPDATE dogadanja
       SET
         obicaj_id = ?,
         naziv = ?,
         opis = ?,
         datum_pocetka = ?,
         datum_zavrsetka = ?,
         lokacija = ?,
         status_objave = ?
       WHERE id = ?`,
      [
        Number(obicaj_id),
        naziv.trim(),
        opis?.trim() || null,
        datum_pocetka,
        datum_zavrsetka || null,
        lokacija.trim(),
        status_objave === '1' ? 1 : 0,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send(
        'Događanje nije pronađeno.'
      );
    }

    req.session.successMessage = 'Događanje je uspješno ažurirano.';
    res.redirect('/admin/dogadanja');
  } catch (error) {
    console.error(
      'Greška pri uređivanju događanja:',
      error.message
    );

    res.status(500).send(
      'Došlo je do greške pri uređivanju događanja.'
    );
  }
};

/**
 * Briše događanje iz baze.
 */
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `DELETE FROM dogadanja
       WHERE id = ?`,
      [id]
    );



    if (result.affectedRows === 0) {
      return res.status(404).send(
        'Događanje nije pronađeno.'
      );
    }


    req.session.successMessage = 'Događanje je uspješno obrisano.';
    res.redirect('/admin/dogadanja');
  } catch (error) {
    console.error(
      'Greška pri brisanju događanja:',
      error.message
    );

    res.status(500).send(
      'Došlo je do greške pri brisanju događanja.'
    );
  }
};