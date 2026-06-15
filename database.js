const Database = require('better-sqlite3');

const db = new Database('anmeldungen.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS anmeldungen (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vorname TEXT NOT NULL,
    nachname TEXT NOT NULL,
    email TEXT NOT NULL,
    telefon TEXT,
    geburtsdatum TEXT,
    geschlecht TEXT,
    distanz TEXT,
    startblock TEXT,
    tshirt_groesse TEXT,
    parkausweis INTEGER,
    notfall_name TEXT,
    notfall_telefon TEXT,
    zahlungsmethode TEXT,
    betrag_chf REAL,
    anmelde_datum TEXT DEFAULT CURRENT_TIMESTAMP,
    status TEXT
  )
`);

module.exports = db;
