import { describe, expect, it } from 'vitest'
import * as XLSX from 'xlsx'
import { parseCsvText, parseWorkbook } from './parse'

describe('parseCsvText', () => {
  it('reads headers and trims string cells', () => {
    const csv = 'Item Name,Qty,Location\nTomato Paste, 3 ,Pantry\nSugar,10,Kitchen\n'
    const { headers, rows } = parseCsvText(csv)
    expect(headers).toEqual(['Item Name', 'Qty', 'Location'])
    expect(rows).toHaveLength(2)
    expect(rows[0]).toEqual({
      'Item Name': 'Tomato Paste',
      Qty: '3',
      Location: 'Pantry',
    })
  })

  it('skips blank lines', () => {
    const csv = 'a,b\n1,2\n\n3,4\n'
    const { rows } = parseCsvText(csv)
    expect(rows).toHaveLength(2)
  })
})

describe('parseWorkbook', () => {
  it('reads the first sheet into headers + rows', () => {
    const aoa = [
      ['Name', 'Qty'],
      ['Olive Oil', 2],
      ['Flour', 5],
    ]
    const ws = XLSX.utils.aoa_to_sheet(aoa)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer

    const { headers, rows } = parseWorkbook(buf)
    expect(headers).toEqual(['Name', 'Qty'])
    expect(rows[0]).toEqual({ Name: 'Olive Oil', Qty: '2' })
    expect(rows).toHaveLength(2)
  })
})
