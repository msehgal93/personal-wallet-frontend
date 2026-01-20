/**
 * Convert array of objects to CSV string
 */
export function convertToCSV<T extends Record<string, unknown>>(
  data: T[],
  headers: { key: keyof T; label: string }[]
): string {
  if (data.length === 0) {
    return headers.map((h) => h.label).join(',')
  }

  // Create header row
  const headerRow = headers.map((h) => h.label).join(',')

  // Create data rows
  const dataRows = data.map((row) => {
    return headers
      .map((header) => {
        const value = row[header.key]
        // Handle values that might contain commas or quotes
        if (value === null || value === undefined) {
          return ''
        }
        const stringValue = String(value)
        // Escape quotes and wrap in quotes if contains comma or quote
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      })
      .join(',')
  })

  return [headerRow, ...dataRows].join('\n')
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
