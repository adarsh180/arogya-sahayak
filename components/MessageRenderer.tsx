'use client'

import { Fragment, ReactNode } from 'react'

interface MessageRendererProps {
  content: string
  role?: 'user' | 'assistant'
}

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>
    return <Fragment key={index}>{part}</Fragment>
  })
}

function isTableDivider(value: string) {
  return /^\s*\|?\s*:?-{3,}/.test(value) && value.includes('|')
}

function cells(value: string) {
  return value.replace(/^\s*\||\|\s*$/g, '').split('|').map(cell => cell.trim())
}

export default function MessageRenderer({ content }: MessageRendererProps) {
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const output: ReactNode[] = []

  for (let index = 0; index < lines.length;) {
    const line = lines[index].trim()
    if (!line) { index += 1; continue }

    if (line.includes('|') && isTableDivider(lines[index + 1] || '')) {
      const headers = cells(line)
      const rows: string[][] = []
      index += 2
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        rows.push(cells(lines[index]))
        index += 1
      }
      output.push(
        <div className="as-answer-table-wrap" key={`table-${index}`}>
          <table><thead><tr>{headers.map((header, cell) => <th key={cell}>{inline(header)}</th>)}</tr></thead>
            <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((value, cell) => <td key={cell}>{inline(value)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )
      continue
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/)
    if (heading) {
      output.push(<h3 key={index} data-level={heading[1].length}>{inline(heading[2])}</h3>)
      index += 1
      continue
    }

    if (/^[-*•]\s+/.test(line)) {
      const items: string[] = []
      while (index < lines.length && /^[-*•]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*•]\s+/, ''))
        index += 1
      }
      output.push(<ul key={`list-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>)}</ul>)
      continue
    }

    if (/^\d+[.)]\s+/.test(line)) {
      const items: string[] = []
      while (index < lines.length && /^\d+[.)]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+[.)]\s+/, ''))
        index += 1
      }
      output.push(<ol key={`steps-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>)}</ol>)
      continue
    }

    output.push(<p key={index}>{inline(line)}</p>)
    index += 1
  }

  return <div className="as-rich-message">{output}</div>
}
