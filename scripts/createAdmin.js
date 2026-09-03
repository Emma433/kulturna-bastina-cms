require('dotenv').config();

const bcrypt = require('bcrypt');
const db = require('../config/db');

async function createAdmin() {
  try {
    const korisnickoIme = process.env.ADMIN_USERNAME;
    const email = process.env.ADMIN_EMAIL;
    const lozinka = process.env.ADMIN_PASSWORD;

    if (!korisnickoIme || !email || !lozinka) {
      throw new Error(
        'Nedostaju ADMIN_USERNAME, ADMIN_EMAIL ili ADMIN_PASSWORD u .env datoteci.'
      );
    }

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