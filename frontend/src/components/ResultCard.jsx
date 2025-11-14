import React from "react";

export default function ResultCard({ product }) {
  const scorePct = Math.round(product.score * 100);
  const scoreColor = scorePct >= 80 ? "text-green-600" : scorePct >= 50 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-3 flex flex-col h-full">
      <div className="h-48 bg-slate-50 rounded overflow-hidden flex items-center justify-center">
        <img
          src={product.image_url || product.image_path}
          alt={product.name}
          className="object-contain h-full w-full"
          onError={(e) => { e.target.src = "https://placehold.co/400x400?text=No+Image"; }}
        />
      </div>
      <div className="mt-3 flex-1">
        <div className="font-medium text-slate-800 text-sm truncate">{product.name}</div>
        <div className="text-xs text-slate-500 mt-1">{product.category}</div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className={`font-semibold ${scoreColor}`}>{scorePct}%</div>
        <div className="text-xs text-slate-400">similarity</div>
      </div>
    </div>
  );
}
