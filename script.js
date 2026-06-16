// ===== GLOBALE FORMULARDATEN (JSON) =====
let formData = {
  anmelde_id: null,
  anmelde_datum: null,
  status: "ausstehend",
  persoenlich: {
    vorname: "",
    nachname: "",
    email: "",
    telefon: "",
    geburtsdatum: "",
    geschlecht: ""
  },
  laufdetails: {
    distanz: "",
    startblock: "",
    tshirt_groesse: "",
    parkausweis: "",
    notfall_name: "",
    notfall_telefon: ""
  },
  zahlung: {
    methode: "Kreditkarte",
    betrag_chf: 0,
    agb_akzeptiert: false
  }
};

let currentPay = "Kreditkarte";

// ===== PREISE =====
const PREISE = {
  "10 km": 45,
  "Halbmarathon": 65,
  "Marathon": 85
};

// ===== SEITEN-NAVIGATION =====
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));

  if (page === 'start') {
    document.getElementById('page-start').classList.add('active');
    document.querySelectorAll('.nav-link')[0].classList.add('active');
  } else if (page === 'form') {
    document.getElementById('page-form').classList.add('active');
    document.querySelectorAll('.nav-link')[1].classList.add('active');
    goStep(1);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectDistanzAndGo(distanz) {
  showPage('form');
  setTimeout(() => {
    const sel = document.getElementById('distanz');
    // Map to option value
    const map = { '10 km': '10 km', 'Halbmarathon': 'Halbmarathon', 'Marathon': 'Marathon' };
    for (let i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === map[distanz]) {
        sel.selectedIndex = i;
        break;
      }
    }
    // Jump to step 1 first
    goStep(1);
  }, 100);
}

// ===== SCHRITT-NAVIGATION =====
function goStep(n) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.getElementById('step-' + n).classList.add('active');
  updateProgress(n);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress(current) {
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById('prog-' + i);
    el.classList.remove('active', 'done');
    if (i < current) el.classList.add('done');
    else if (i === current) el.classList.add('active');
  }
}

// ===== VALIDIERUNG SCHRITT 1 =====
function validateStep1() {
  let valid = true;

  const fields = [
    { id: 'vorname', errId: 'err-vorname', msg: 'Bitte gib deinen Vornamen ein.' },
    { id: 'nachname', errId: 'err-nachname', msg: 'Bitte gib deinen Nachnamen ein.' },
    { id: 'geburtsdatum', errId: 'err-geburtsdatum', msg: 'Bitte gib dein Geburtsdatum an.' }
  ];

  fields.forEach(f => {
    const el = document.getElementById(f.id);
    const err = document.getElementById(f.errId);
    if (!el.value.trim()) {
      el.classList.add('error');
      err.textContent = f.msg;
      valid = false;
    } else {
      el.classList.remove('error');
      err.textContent = '';
    }
  });

  // E-Mail
  const email = document.getElementById('email');
  const errEmail = document.getElementById('err-email');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !emailRegex.test(email.value)) {
    email.classList.add('error');
    errEmail.textContent = 'Bitte gib eine gültige E-Mail-Adresse ein.';
    valid = false;
  } else {
    email.classList.remove('error');
    errEmail.textContent = '';
  }

  // Geschlecht
  const geschlecht = document.querySelector('input[name="geschlecht"]:checked');
  const errGeschlecht = document.getElementById('err-geschlecht');
  if (!geschlecht) {
    errGeschlecht.textContent = 'Bitte wähle ein Geschlecht aus.';
    valid = false;
  } else {
    errGeschlecht.textContent = '';
  }

  const errBox = document.getElementById('err-1');
  if (!valid) {
    errBox.style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  errBox.style.display = 'none';

  // Daten speichern
  formData.persoenlich.vorname = document.getElementById('vorname').value.trim();
  formData.persoenlich.nachname = document.getElementById('nachname').value.trim();
  formData.persoenlich.email = document.getElementById('email').value.trim();
  formData.persoenlich.telefon = document.getElementById('telefon').value.trim();
  formData.persoenlich.geburtsdatum = document.getElementById('geburtsdatum').value;
  formData.persoenlich.geschlecht = geschlecht.value;

  goStep(2);
}

// ===== VALIDIERUNG SCHRITT 2 =====
function validateStep2() {
  let valid = true;
  const errBox = document.getElementById('err-2');

  const distanz = document.getElementById('distanz');
  const startblock = document.getElementById('startblock');
  const tshirt = document.querySelector('input[name="tshirt"]:checked');
  const parkausweis = document.querySelector('input[name="parkausweis"]:checked');

  distanz.classList.remove('error');
  startblock.classList.remove('error');

  if (!distanz.value) { distanz.classList.add('error'); valid = false; }
  if (!startblock.value) { startblock.classList.add('error'); valid = false; }
  if (!tshirt) valid = false;
  if (!parkausweis) valid = false;

  if (!valid) {
    errBox.style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  errBox.style.display = 'none';

  // Daten speichern
  formData.laufdetails.distanz = distanz.value;
  formData.laufdetails.startblock = startblock.value;
  formData.laufdetails.tshirt_groesse = tshirt.value;
  formData.laufdetails.parkausweis = parkausweis.value;
  formData.laufdetails.notfall_name = document.getElementById('notfall-name').value.trim();
  formData.laufdetails.notfall_telefon = document.getElementById('notfall-tel').value.trim();

  updateSummary();
  goStep(3);
}

// ===== BESTELLÜBERSICHT =====
function updateSummary() {
  const distanz = formData.laufdetails.distanz;
  const basisPreis = PREISE[distanz] || 0;
  const tshirtPreis = 10;
  const total = basisPreis + tshirtPreis;

  document.getElementById('sum-distanz').textContent = distanz;
  document.getElementById('sum-preis').textContent = `CHF ${basisPreis}.00`;
  document.getElementById('sum-tshirt').textContent = `T-Shirt ${formData.laufdetails.tshirt_groesse}`;
  document.getElementById('sum-total').textContent = `CHF ${total}.00`;

  formData.zahlung.betrag_chf = total;
}

// ===== ZAHLUNGSMETHODE =====
function selectPay(el, method) {
  document.querySelectorAll('.pay-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  currentPay = method;
  formData.zahlung.methode = method;

  const kkFields = document.getElementById('kreditkarte-fields');
  kkFields.style.display = method === 'Kreditkarte' ? 'block' : 'none';
}

function formatKarte(input) {
  let val = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = val.replace(/(.{4})/g, '$1 ').trim();
}

// ===== ANMELDUNG AN API SENDEN =====
function buildAnmeldungPayload() {
  const p = formData.persoenlich;
  const l = formData.laufdetails;
  const z = formData.zahlung;

  return {
    vorname: p.vorname,
    nachname: p.nachname,
    email: p.email,
    telefon: p.telefon,
    geburtsdatum: p.geburtsdatum,
    geschlecht: p.geschlecht,
    distanz: l.distanz,
    startblock: l.startblock,
    tshirt_groesse: l.tshirt_groesse,
    parkausweis: l.parkausweis,
    notfall_name: l.notfall_name,
    notfall_telefon: l.notfall_telefon,
    zahlungsmethode: z.methode,
    betrag_chf: z.betrag_chf,
    status: formData.status
  };
}

// ===== VALIDIERUNG SCHRITT 3 =====
async function validateStep3() {
  let valid = true;
  const errBox = document.getElementById('err-3');

  const agb = document.getElementById('agb');

  if (currentPay === 'Kreditkarte') {
    const nr = document.getElementById('karte-nr').value.replace(/\s/g, '');
    const ablauf = document.getElementById('karte-ablauf').value;
    const cvv = document.getElementById('karte-cvv').value;
    const inhaber = document.getElementById('karte-inhaber').value.trim();

    ['karte-nr','karte-ablauf','karte-cvv','karte-inhaber'].forEach(id => {
      document.getElementById(id).classList.remove('error');
    });

    if (nr.length < 16) { document.getElementById('karte-nr').classList.add('error'); valid = false; }
    if (!ablauf) { document.getElementById('karte-ablauf').classList.add('error'); valid = false; }
    if (cvv.length < 3) { document.getElementById('karte-cvv').classList.add('error'); valid = false; }
    if (!inhaber) { document.getElementById('karte-inhaber').classList.add('error'); valid = false; }
  }

  if (!agb.checked) valid = false;

  if (!valid) {
    errBox.textContent = 'Bitte korrigiere die markierten Felder.';
    errBox.style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  errBox.style.display = 'none';

  formData.zahlung.agb_akzeptiert = true;
  formData.status = 'bezahlt';

  try {
    const response = await fetch('/api/anmeldungen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildAnmeldungPayload())
    });

    if (!response.ok) {
      throw new Error('Serverfehler beim Speichern der Anmeldung.');
    }

    const gespeicherteAnmeldung = await response.json();
    formData.anmelde_id = gespeicherteAnmeldung.id;
    formData.anmelde_datum = gespeicherteAnmeldung.anmelde_datum;

    buildConfirmation();
    goStep(4);
  } catch (err) {
    errBox.textContent = 'Die Anmeldung konnte nicht gespeichert werden. Bitte versuche es später erneut.';
    errBox.style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ===== DATUM FORMATIEREN =====
function formatAnmeldeDatum(datum) {
  if (!datum) return '–';
  const iso = datum.includes('T') ? datum : datum.replace(' ', 'T') + 'Z';
  return new Date(iso).toLocaleString('de-CH');
}

// ===== BESTÄTIGUNG AUFBAUEN =====
function buildConfirmation() {
  const p = formData.persoenlich;
  const l = formData.laufdetails;
  const z = formData.zahlung;

  document.getElementById('success-text').textContent =
    `${p.vorname} ${p.nachname}, du bist für den ${l.distanz} 2025 angemeldet.`;

  const rows = [
    ['Anmelde-ID', formData.anmelde_id],
    ['Anmeldedatum', formatAnmeldeDatum(formData.anmelde_datum)],
    ['Distanz', l.distanz],
    ['Startblock', l.startblock],
    ['T-Shirt Grösse', l.tshirt_groesse],
    ['Betrag', `CHF ${z.betrag_chf}.00`],
    ['Bezahlmethode', z.methode],
  ];

  const container = document.getElementById('final-summary');
  container.innerHTML = rows.map(([k, v]) =>
    `<div class="summary-card-row"><span>${k}</span><span>${v}</span></div>`
  ).join('');
}

// ===== JSON DOWNLOAD =====
function downloadJSON() {
  const json = JSON.stringify(formData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `anmeldung_${formData.anmelde_id || 'zm2025'}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  showPage('start');

  // Kreditkartenfelder initial sichtbar
  document.getElementById('kreditkarte-fields').style.display = 'block';
});
