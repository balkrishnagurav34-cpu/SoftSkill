// Skillverse: saves feedback AND contacts into one Google Sheet.
// Tabs are created automatically: "Feedback" and "Contacts".
const FEEDBACK_TAB = 'Feedback';
const CONTACT_TAB = 'Contacts';

function tab_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  }
  return sh;
}

function clean_(v, max) {
  return String(v == null ? '' : v).slice(0, max);
}

// Writes a row as plain text, so nothing (like "=..." or "+91...") is treated as a formula.
function addRow_(sh, values) {
  const r = sh.getLastRow() + 1;
  const rng = sh.getRange(r, 1, 1, values.length);
  rng.setNumberFormat('@');
  rng.setValues([values]);
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.website) return out_({ ok: true }); // spam trap
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      if (d.type === 'contact') {
        addRow_(tab_(CONTACT_TAB, ['Time', 'Name', 'Email', 'Phone', 'Message']),
          [clean_(d.time, 40), clean_(d.name, 60), clean_(d.email, 100), clean_(d.phone, 20), clean_(d.message, 500)]);
      } else {
        const rating = Math.max(1, Math.min(5, Math.round(+d.rating || 0)));
        addRow_(tab_(FEEDBACK_TAB, ['Time', 'Name', 'Email', 'Rating', 'Message']),
          [clean_(d.time, 40), clean_(d.name, 60), clean_(d.email, 100), String(rating), clean_(d.message, 500)]);
      }
    } finally {
      lock.releaseLock();
    }
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false });
  }
}

// Public: only reviews (no emails). Contacts are never sent back to the website.
function doGet() {
  const sh = tab_(FEEDBACK_TAB, ['Time', 'Name', 'Email', 'Rating', 'Message']);
  const rows = sh.getDataRange().getValues().slice(1);
  const reviews = rows
    .filter(r => r[1] && r[4])
    .map(r => ({ time: String(r[0]), name: String(r[1]), rating: +r[3] || 0, message: String(r[4]) }))
    .reverse()
    .slice(0, 200);
  return out_({ ok: true, reviews: reviews });
}
