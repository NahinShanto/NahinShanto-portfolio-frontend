export default function DataTable({ columns, rows, rowKey = (r) => r.id }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-border bg-surface-2 text-muted">
          <tr>
            {columns.map((c) => (
              <th key={c.header} scope="col" className="px-4 py-4 font-medium">{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-b border-border last:border-0">
              {columns.map((c) => (
                <td key={c.header} className="px-4 py-4 align-middle">{c.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}