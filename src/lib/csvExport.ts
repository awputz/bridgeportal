/**
 * CSV Export Utility
 * Converts data arrays to CSV format and triggers download
 */

export interface CSVColumn<T> {
  key: keyof T | string;
  header: string;
  formatter?: (value: any, row: T) => string;
}

/**
 * Escape CSV values to handle special characters
 */
const escapeCSVValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // If value contains comma, newline, or double quote, wrap in quotes
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"') || stringValue.includes('\r')) {
    // Escape double quotes by doubling them
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
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
 * Convert data array to CSV string
 */
export function convertToCSV<T>(
  data: T[],
  columns: CSVColumn<T>[]
): string {
  // Create header row
  const headers = columns.map(col => escapeCSVValue(col.header));
  const headerRow = headers.join(',');
  
  // Create data rows
  const dataRows = data.map(row => {
    return columns.map(col => {
      const key = col.key as string;
      const rawValue = getNestedValue(row, key);
      const value = col.formatter ? col.formatter(rawValue, row) : rawValue;
      return escapeCSVValue(value);
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Trigger download of CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  // Add BOM for Excel compatibility with UTF-8
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
}

/**
 * Export data to CSV and trigger download
 */
export function exportToCSV<T>(
  data: T[],
  columns: CSVColumn<T>[],
  filename: string
): void {
  const csvContent = convertToCSV(data, columns);
  downloadCSV(csvContent, filename);
}

/**
 * Format currency for CSV export
 */
export const formatCurrencyCSV = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '';
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Format date for CSV export
 */
export const formatDateCSV = (value: string | null | undefined): string => {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-US');
};

/**
 * Format array for CSV export
 */
export const formatArrayCSV = (value: string[] | null | undefined): string => {
  if (!value || value.length === 0) return '';
  return value.join('; ');
};