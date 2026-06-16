# API-Tests mit Postman

## Voraussetzung

Server starten:
```bash
node server.js
```
Der Server läuft dann auf `http://localhost:3000`.

---

## 1. POST /api/anmeldungen – Neue Anmeldung erstellen

| Feld | Wert |
|---|---|
| Method | `POST` |
| URL | `http://localhost:3000/api/anmeldungen` |
| Body-Typ | `raw` → `JSON` |

**Request Body:**
```json
{
  "vorname": "Anna",
  "nachname": "Beispiel",
  "email": "anna@beispiel.ch",
  "telefon": "+41 79 123 45 67",
  "geburtsdatum": "1995-03-15",
  "geschlecht": "Weiblich",
  "distanz": "Halbmarathon",
  "startblock": "Hobbyläufer A",
  "tshirt_groesse": "S",
  "parkausweis": "Nein",
  "notfall_name": "Max Beispiel",
  "notfall_telefon": "+41 79 987 65 43",
  "zahlungsmethode": "TWINT",
  "betrag_chf": 75,
  "status": "bezahlt"
}
```

**Erwartete Antwort (201 Created):**
```json
{
  "id": 1,
  "vorname": "Anna",
  "nachname": "Beispiel",
  "email": "anna@beispiel.ch",
  "anmelde_datum": "2025-04-27 10:00:00",
  "status": "bezahlt",
  ...
}
```

---

## 2. GET /api/anmeldungen – Alle Anmeldungen abrufen

| Feld | Wert |
|---|---|
| Method | `GET` |
| URL | `http://localhost:3000/api/anmeldungen` |

Kein Body nötig. Gibt alle gespeicherten Anmeldungen als JSON-Array zurück.

**Erwartete Antwort (200 OK):**
```json
[
  { "id": 1, "vorname": "Anna", ... },
  { "id": 2, "vorname": "Max", ... }
]
```

---

## 3. GET /api/anmeldungen/:id – Einzelne Anmeldung abrufen

| Feld | Wert |
|---|---|
| Method | `GET` |
| URL | `http://localhost:3000/api/anmeldungen/1` |

Die `:id` in der URL durch die gewünschte ID ersetzen.

**Erwartete Antwort (200 OK):** Einzelnes Anmeldungs-Objekt.

**Nicht gefunden (404):**
```json
{ "error": "Anmeldung nicht gefunden" }
```
