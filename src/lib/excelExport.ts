/**
 * Excel Export Utility
 * Creates Excel-compatible XML spreadsheet format
 */

export interface ExcelColumn<T> {
  key: keyof T | string;
  header: string;
  formatter?: (value: any, row: T) => string | number;
  type?: 'string' | 'number';
}

/**
 * Escape XML special characters
 */
const escapeXml = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

/**
 * Get nested value from object using dot notation
 */
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

/**
 * Convert data array to Excel XML format
 */
export function convertToExcelXML<T>(
  data: T[],
  columns: ExcelColumn<T>[],
  sheetName: string = 'Sheet1'
): string {
  const headerRow = columns
    .map(col => `<Cell><Data ss:Type="String">${escapeXml(col.header)}</Data></Cell>`)
    .join('');

  const dataRows = data.map(row => {
    const cells = columns.map(col => {
      const key = col.key as string;
      const rawValue = getNestedValue(row, key);
      const value = col.formatter ? col.formatter(rawValue, row) : rawValue;
      const type = col.type || (typeof value === 'number' ? 'Number' : 'String');
      const displayValue = value === null || value === undefined ? '' : String(value);
      
      return `<Cell><Data ss:Type="${type}">${escapeXml(displayValue)}</Data></Cell>`;
    }).join('');
    
    return `<Row>${cells}</Row>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="header">
      <Font ss:Bold="1"/>
      <Interior ss:Color="#E0E0E0" ss:Pattern="Solid"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="${escapeXml(sheetName)}">
    <Table>
      <Row ss:StyleID="header">${headerRow}</Row>
      ${dataRows}
    </Table>
  </Worksheet>
</Workbook>`;
}

/**
 * Trigger download of Excel file
 */
export function downloadExcel(xmlContent: string, filename: string): void {
  const blob = new Blob([xmlContent], { 
    type: 'application/vnd.ms-excel;charset=utf-8;' 
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.xls`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Export data to Excel and trigger download
 */
export function exportToExcel<T>(
  data: T[],
  columns: ExcelColumn<T>[],
  filename: string,
  sheetName?: string
): void {
  const xmlContent = convertToExcelXML(data, columns, sheetName);
  downloadExcel(xmlContent, filename);
}

/**
 * Format currency for Excel export
 */
export const formatCurrencyExcel = (value: number | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  return value;
};

/**
 * Format date for Excel export
 */
export const formatDateExcel = (value: string | null | undefined): string => {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-US');
};
