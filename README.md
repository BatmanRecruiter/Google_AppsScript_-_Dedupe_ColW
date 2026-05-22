Sort & Dedupe by Column W
A Google Apps Script utility for Google Sheets that sorts the active sheet by Column Z, then flags duplicates in Column W by marking "Duplicate" in Column A — without overwriting any existing values in A.

Features
Header-safe sort — sorts all rows below Row 1 by Column Z (ascending), keeping the header row pinned in place.

Blanks last — empty/null Column Z values are pushed to the bottom of the sort instead of being mixed in.

Column W dedupe — scans Column W after sorting and identifies the second-and-later occurrences of any repeated value as duplicates.

Non-destructive flagging — writes "Duplicate" into Column A only when the cell is currently blank, preserving any existing labels, notes, or status values.

Empty W = ignored — blank Column W cells are never flagged as duplicates of each other.

Toast feedback — shows a Google Sheets toast notification when the run finishes (or when no data exists below the header).

Single-sheet operation — runs against whichever sheet is currently active, so you control where it executes.

Installation
Open the target Google Sheet → Extensions → Apps Script.

Paste the contents of this repo's .js file into Code.gs (or add it as a new file in an existing project).

Click Save (💾) and name the project.

Optionally wire it into a custom menu (e.g., Dedupe → Dedupe W) so non-technical users can run it from the Sheets toolbar.

From the function dropdown, select sortAndDedupeColumnW and click Run once to grant authorization.

Note: This must be a container-bound script (created via Extensions → Apps Script from inside the sheet).

Usage
Open the sheet you want to dedupe and make sure Row 1 contains your headers.

Confirm Column W holds the values you want to dedupe by, and Column Z holds the values you want to sort by.

Run sortAndDedupeColumnW — from the Apps Script editor, a custom menu, or a button.

The sheet is sorted by Z, duplicates in W are flagged in A, and you'll see a ✅ toast confirming the run.

How It Works
Reads the header row and the data block separately so Row 1 is never moved.

Sorts the data array in memory by Column Z, sending blanks to the bottom.

Writes the sorted data back below the header.

Re-reads the full sheet, walks Column W top-to-bottom, and tracks seen values in a Set.

Builds a parallel "Duplicate" flag array — first occurrence of each W value is blank; subsequent occurrences are flagged.

Reads Column A's current values and only writes "Duplicate" into rows where A is currently empty, leaving existing content untouched.

Configuration
Sort column: change const colZ = 26; to a different 1-based column index.

Dedupe column: change const colW = 23; to dedupe by a different field.

Flag column: change const colA = 1; to write "Duplicate" markers somewhere other than Column A.

Flag text: replace the string "Duplicate" if you prefer different wording.

Sort direction: flip valA < valB ? -1 : 1 to valA > valB ? -1 : 1 for descending order.

Requirements
Google account with edit access to the target spreadsheet.

Script must be bound to the spreadsheet.

Authorization scope: SpreadsheetApp (read/write the active sheet).

A header row in Row 1.

Troubleshooting
"No data found below the header row" toast: the sheet only has Row 1, or is empty — add data and re-run.

Existing Column A values not being overwritten: that's by design — the script only writes "Duplicate" into blank cells in A.

Wrong rows flagged as duplicates: confirm Column W is the correct dedupe field and that values match exactly (whitespace and case differences count as distinct values).

Sort looks off: blanks intentionally go to the bottom; mixed types (numbers vs. strings) may not sort the way you expect — normalize Column Z first if needed.
