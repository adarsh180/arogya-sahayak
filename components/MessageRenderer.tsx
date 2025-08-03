'use client'

interface MessageRendererProps {
  content: string
  role: 'user' | 'assistant'
}

export default function MessageRenderer({ content, role }: MessageRendererProps) {
  const lines = content.split('\n')
  const elements: JSX.Element[] = []
  let tableLines: string[] = []
  let inTable = false
  
  lines.forEach((line, index) => {
    const isTableLine = (line.match(/\|/g) || []).length >= 2
    
    if (isTableLine) {
      if (!inTable) {
        inTable = true
        tableLines = []
      }
      tableLines.push(line)
    } else {
      if (inTable) {
        // Render accumulated table
        const tableRows = tableLines.filter(l => l.trim())
        if (tableRows.length > 0) {
          const headerRow = tableRows[0]
          const separatorIndex = tableRows.findIndex(row => row.includes('---'))
          const dataRows = separatorIndex > 0 ? tableRows.slice(separatorIndex + 1) : tableRows.slice(1)
          
          elements.push(
            <div key={`table-${index}`} className="my-4 overflow-x-auto">
              <table className="min-w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {headerRow.split('|').filter(cell => cell.trim()).map((header, i) => (
                      <th key={i} className="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">
                        {header.trim()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataRows.map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                      {row.split('|').filter(cell => cell.trim()).map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">
                          {cell.trim()}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
        inTable = false
        tableLines = []
      }
      
      // Render regular line
      if (line.trim()) {
        elements.push(
          <p key={index} className="mb-2 lg:mb-3 last:mb-0 text-gray-800 dark:text-gray-200">
            {line.startsWith('•') ? (
              <span className="flex items-start">
                <span className={`mr-2 mt-1 ${
                  role === 'user' ? 'text-white' : 'text-blue-600 dark:text-blue-400'
                }`}>•</span>
                <span>{line.substring(1).trim()}</span>
              </span>
            ) : line}
          </p>
        )
      } else {
        elements.push(<br key={index} />)
      }
    }
  })
  
  // Handle any remaining table at the end
  if (inTable && tableLines.length > 0) {
    const tableRows = tableLines.filter(l => l.trim())
    if (tableRows.length > 0) {
      const headerRow = tableRows[0]
      const separatorIndex = tableRows.findIndex(row => row.includes('---'))
      const dataRows = separatorIndex > 0 ? tableRows.slice(separatorIndex + 1) : tableRows.slice(1)
      
      elements.push(
        <div key="final-table" className="my-4 overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {headerRow.split('|').filter(cell => cell.trim()).map((header, i) => (
                  <th key={i} className="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">
                    {header.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                  {row.split('|').filter(cell => cell.trim()).map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
  }
  
  return <div className="leading-relaxed">{elements}</div>
}