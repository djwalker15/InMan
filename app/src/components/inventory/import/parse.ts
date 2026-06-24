import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import type { ParsedFile } from './types'

function stringifyRow(
  raw: Record<string, unknown>,
  headers: string[],
): Record<string, string> {
  const row: Record<string, string> = {}
  for (const h of headers) {
    const v = raw[h]
    row[h] = v == null ? '' : String(v).trim()
  }
  return row
}

/** Parse CSV text into headers + string-valued rows. */
export function parseCsvText(text: string): ParsedFile {
  const result = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (h) => h.trim(),
  })
  const headers = (result.meta.fields ?? []).filter((h) => h.length > 0)
  const rows = (result.data as Record<string, unknown>[]).map((r) =>
    stringifyRow(r, headers),
  )
  return { headers, rows }
}

/** Parse an .xlsx/.xls workbook (first sheet) into headers + string rows. */
export function parseWorkbook(buffer: ArrayBuffer): ParsedFile {
  const wb = XLSX.read(buffer, { type: 'array' })
  const sheetName = wb.SheetNames[0]
  if (!sheetName) return { headers: [], rows: [] }
  const sheet = wb.Sheets[sheetName]
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: '',
    blankrows: false,
    raw: false,
  })
  if (aoa.length === 0) return { headers: [], rows: [] }
  const headers = (aoa[0] as unknown[])
    .map((h) => String(h ?? '').trim())
    .filter((h) => h.length > 0)
  const rows = aoa.slice(1).map((arr) => {
    const cells = arr as unknown[]
    const raw: Record<string, unknown> = {}
    headers.forEach((h, i) => {
      raw[h] = cells[i]
    })
    return stringifyRow(raw, headers)
  })
  return { headers, rows }
}

/** Parse a user-supplied CSV or XLSX file into a {@link ParsedFile}. */
export async function parseFile(file: File): Promise<ParsedFile> {
  const name = file.name.toLowerCase()
  if (name.endsWith('.csv')) {
    return parseCsvText(await file.text())
  }
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
    return parseWorkbook(await file.arrayBuffer())
  }
  throw new Error('Unsupported file type. Upload a .csv or .xlsx file.')
}
