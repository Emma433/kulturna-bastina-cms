require('dotenv').config();

const bcrypt = require('bcrypt');
const db = require('../config/db');

async function createAdmin() {
  try {
    const korisnickoIme = 'emma';
    const email = 'emma.znidaric1234@gmail.com';
    const lozinka = 'Lozinka123!';

    const lozinkaHash = await bcrypt.hash(lozinka, 12);

    await db.query(
      `INSERT INTO administratori
       (korisnicko_ime, email, lozinka_hash)
       VALUES (?, ?, ?)`,
      [korisnickoIme, email, lozinkaHash]
    );

    console.log('Administrator je uspješno kreiran.');
  } catch (error) {
    console.error('Greška:', error.message);
  } finally {
    await db.end();
  }
}

createAdmin();