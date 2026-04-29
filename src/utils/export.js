function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function normalizeSheetRows(rows = []) {
  if (!rows.length) return { headers: ["Information"], rows: [{ Information: "Aucune donnée disponible" }] };
  const headers = [...new Set(rows.flatMap((row) => Object.keys(row || {})))];
  return { headers, rows };
}

export function exportWorkbookToExcel(sheets, fileName = "export-bumi.xls") {
  const safeSheets = sheets.length
    ? sheets
    : [{ name: "Données", rows: [{ Information: "Aucune donnée disponible" }] }];

  const workbookXml = `<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n${safeSheets
    .map((sheet) => {
      const { headers, rows } = normalizeSheetRows(sheet.rows);
      return `  <Worksheet ss:Name="${escapeXml(sheet.name || "Données")}">\n    <Table>\n      <Row>${headers
        .map((header) => `<Cell><Data ss:Type="String">${escapeXml(header)}</Data></Cell>`)
        .join("")}</Row>\n      ${rows
        .map(
          (row) =>
            `<Row>${headers
              .map((header) => `<Cell><Data ss:Type="String">${escapeXml(row?.[header])}</Data></Cell>`)
              .join("")}</Row>`
        )
        .join("\n")}\n    </Table>\n  </Worksheet>`;
    })
    .join("\n")}\n</Workbook>`;

  const blob = new Blob([workbookXml], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToExcel(rows, fileName = "export-bumi.xls", sheetName = "Données") {
  exportWorkbookToExcel([{ name: sheetName, rows }], fileName);
}
