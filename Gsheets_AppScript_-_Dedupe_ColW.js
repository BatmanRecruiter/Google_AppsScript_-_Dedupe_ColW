/**
 * Sorts the active sheet by Column Z (26) only,
 * preserves the header row (Row 1),
 * deduplicates Column W (23),
 * and marks "Duplicate" in Column A (1) without overwriting existing data.
 */
function sortAndDedupeColumnW() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  if (lastRow <= 1) {
    SpreadsheetApp.getActive().toast("No data found below the header row.");
    return;
  }

  // Column indexes (1-based)
  const colW = 23; // W
  const colZ = 26; // Z
  const colA = 1;  // A

  // ---- 1. Separate header and data ----
  const header = sheet.getRange(1, 1, 1, lastCol).getValues();
  const dataRange = sheet.getRange(2, 1, lastRow - 1, lastCol);
  const dataValues = dataRange.getValues();

  // ---- 2. Sort data by column Z only (skip header) ----
  dataValues.sort(function (a, b) {
    const valA = a[colZ - 1];
    const valB = b[colZ - 1];

    if (valA === valB) return 0;
    if (valA === "" || valA === null) return 1; // blanks go to bottom
    if (valB === "" || valB === null) return -1;
    return valA < valB ? -1 : 1;
  });

  // ---- 3. Write sorted data back (below header) ----
  sheet.getRange(2, 1, dataValues.length, lastCol).setValues(dataValues);

  // ---- 4. Read all values again (including header) ----
  const allValues = sheet.getDataRange().getValues();
  const seen = new Set();
  const flags = [];

  // ---- 5. Build "Duplicate" flags for Column W ----
  for (let i = 0; i < allValues.length; i++) {
    const cellValue = allValues[i][colW - 1]; // adjust for 0-based index
    if (i === 0) {
      flags.push(""); // header row
      continue;
    }
    if (cellValue !== "" && seen.has(cellValue)) {
      flags.push("Duplicate");
    } else {
      seen.add(cellValue);
      flags.push("");
    }
  }

  // ---- 6. Write flags into Column A if blank cells ----
  const aRange = sheet.getRange(1, colA, lastRow, 1);
  const currentA = aRange.getValues();

  for (let i = 0; i < flags.length; i++) {
    const alreadyHasValue = currentA[i][0] !== "";
    const newMark = flags[i] === "Duplicate";
    if (newMark && !alreadyHasValue) {
      currentA[i][0] = "Duplicate";
    }
  }

  aRange.setValues(currentA);

  SpreadsheetApp.getActive().toast(
    "✅ Sorted by Column Z only. Header preserved. Duplicates marked in Column A!"
  );
}