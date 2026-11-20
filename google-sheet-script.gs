/**
 * Barney's Fuel Log · Google Sheet backend
 * Paste this into the sheet: Extensions → Apps Script, replace everything, Save,
 * then Deploy → New deployment → Web app · Execute as: Me · Who has access: Anyone.
 */
const TAB = 'Fuel log';
const HEAD = ['Stop', 'Arrived', 'Submitted by', 'Submitted at', 'Carbs (g)', 'Carbs / hr', 'Eaten', 'Extras', 'Note', 'id', 'data'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(TAB);
  if (!s) {
    s = ss.insertSheet(TAB, 0);
    s.appendRow(HEAD);
    s.setFrozenRows(1);
    s.getRange(1, 1, 1, HEAD.length).setFontWeight('bold');
    s.hideColumns(10, 2); // id + raw data: the website needs them, you don't
  }
  return s;
}

function read_() {
  const v = sheet_().getDataRange().getValues(), out = {};
  for (let r = 1; r < v.length; r++) {
    const id = v[r][9], data = v[r][10];
    if (id && data) { try { out[id] = JSON.parse(data); } catch (e) {} }
  }
  return out;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return json_({ ok: true, log: read_() });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const b = JSON.parse(e.postData.contents), s = sheet_();
    if (b.action === 'clear') {
      if (s.getLastRow() > 1) s.deleteRows(2, s.getLastRow() - 1);
      return json_({ ok: true, log: {} });
    }
    const r = b.row || {};
    const vals = [r.stop, r.arrived, r.by, r.at, r.carbs, r.gph, r.eaten, r.extras, r.note, b.id, JSON.stringify(b.entry)];
    const v = s.getDataRange().getValues();
    let row = -1;
    for (let i = 1; i < v.length; i++) if (v[i][9] === b.id) { row = i + 1; break; }
    if (row > 0) s.getRange(row, 1, 1, vals.length).setValues([vals]);
    else s.appendRow(vals);
    if (s.getLastRow() > 2) s.getRange(2, 1, s.getLastRow() - 1, HEAD.length).sort(1); // race order
    return json_({ ok: true, log: read_() });
  } finally {
    lock.releaseLock();
  }
}
