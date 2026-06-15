# Zürich Marathon – Anmeldeformular

Mehrstufiges Webformular für die Anmeldung zum Zürich Marathon. Schulprojekt im Modul m322_2025 am Berufsbildungszentrum Zürich.

## Über das Projekt

Das Formular führt Läuferinnen und Läufer in vier Schritten durch die Anmeldung:

1. **Persönliche Angaben** – Name, E-Mail, Geburtsdatum, Geschlecht
2. **Laufdetails** – Distanz, Startblock, T-Shirt-Grösse, Parkausweis
3. **Zahlung** – Bestellübersicht, Zahlungsmethode, Kreditkartendaten
4. **Bestätigung** – Zusammenfassung und JSON-Export der Anmeldung

## Funktionen

- Mehrstufiger Ablauf mit Fortschrittsanzeige
- Feldvalidierung mit Fehlermeldungen bei jedem Schritt
- Zurück-Navigation ohne Datenverlust
- Automatische Preisberechnung in der Bestellübersicht
- Export der Anmeldedaten als JSON
- Responsives Layout (Desktop und Mobile)

## Technologie

- HTML5
- CSS3 (Custom Properties, Flexbox, Grid)
- Vanilla JavaScript (kein Framework)
- Schriften: Lexend (Headlines), Inter (Body)

## Verwendung

Repository klonen und `index.html` im Browser öffnen:

```bash
git clone https://github.com/AurelEugster/Zuerich-Marathon.git
cd Zuerich-Marathon
```

Anschliessend `index.html` mit einem Browser öffnen – kein Build-Schritt notwendig.

## Design

| Element | Wert |
|---------|------|
| Primärfarbe | `#D32F2F` |
| Sekundärfarbe | `#1A1A1A` |
| Text | `#555555` |
| Hintergrund | `#FFFFFF` |

## Team

- Aurel
- Maurice
- Moreno

## Lizenz

Schulprojekt – nur für Ausbildungszwecke.
