export default function ResultsTable({
  data,
}: {
  data: Record<string, unknown>[];
}) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const columns = Object.keys(data[0]);

  return (
    <div className="mt-2 overflow-auto max-h-48 rounded border border-gray-200">
      <table className="min-w-full text-xs">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-3 py-1.5 text-left font-semibold text-gray-700 whitespace-nowrap border-b border-gray-200"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {columns.map((col) => (
                <td
                  key={col}
                  className="px-3 py-1.5 text-gray-800 whitespace-nowrap border-b border-gray-100"
                >
                  {row[col] === null || row[col] === undefined ? (
                    <span className="text-gray-400 italic">null</span>
                  ) : (
                    String(row[col])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
