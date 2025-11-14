import React from "react";

export default function Pagination({ page, total, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => onChange(1)} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">First</button>
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
      <div className="px-3 py-1 border rounded bg-white text-sm"> {page} / {total} </div>
      <button onClick={() => onChange(Math.min(total, page + 1))} disabled={page === total} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
      <button onClick={() => onChange(total)} disabled={page === total} className="px-3 py-1 border rounded disabled:opacity-50">Last</button>
    </div>
  );
}
