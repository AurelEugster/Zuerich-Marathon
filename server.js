const express = require('express');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const FELDER = [
  'vorname', 'nachname', 'email', 'telefon', 'geburtsdatum', 'geschlecht',
  'distanz', 'startblock', 'tshirt_groesse', 'parkausweis',
  'notfall_name', 'notfall_telefon', 'zahlungsmethode', 'betrag_chf', 'status'
];

const insertAnmeldung = db.prepare(`
  INSERT INTO anmeldungen (${FELDER.join(', ')})
  VALUES (${FELDER.map(f => '@' + f).join(', ')})
`);

const getAnmeldungById = db.prepare('SELECT * FROM anmeldungen WHERE id = ?');
const getAlleAnmeldungen = db.prepare('SELECT * FROM anmeldungen ORDER BY id');

// POST /api/anmeldungen
app.post('/api/anmeldungen', (req, res) => {
  const werte = {};
  for (const feld of FELDER) {
    const wert = req.body[feld];
    werte[feld] = wert === undefined ? null : wert;
  }

  try {
    const result = insertAnmeldung.run(werte);
    const neueAnmeldung = getAnmeldungById.get(result.lastInsertRowid);
    res.status(201).json(neueAnmeldung);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/anmeldungen
app.get('/api/anmeldungen', (req, res) => {
  res.json(getAlleAnmeldungen.all());
});

// GET /api/anmeldungen/:id
app.get('/api/anmeldungen/:id', (req, res) => {
  const anmeldung = getAnmeldungById.get(req.params.id);
  if (!anmeldung) {
    return res.status(404).json({ error: 'Anmeldung nicht gefunden' });
  }
  res.json(anmeldung);
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
