import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import LoadingSpinner from "./components/LoadingSpinner";
import ResultCard from "./components/ResultCard";
import Pagination from "./components/Pagination";
import Modal from "./components/Modal";
import "./index.css";

const BACKEND_SEARCH = "http://127.0.0.1:5000/search";
const PAGE_SIZE = 8;

export default function App() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [minScore, setMinScore] = useState(0);
  const [page, setPage] = useState(1);
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem("vpm_history") || "[]");
    setHistory(h);
  }, []);

  useEffect(() => {
    const f = results.filter((r) => Math.round(r.score * 100) >= minScore);
    setFiltered(f);
    setPage(1);
  }, [results, minScore]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setImageUrl("");
    setPreview(URL.createObjectURL(f));
  };

  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setPreview(e.target.value);
    setFile(null);
  };

  const addToHistory = (entry) => {
    const newHist = [entry, ...history].slice(0, 10);
    setHistory(newHist);
    localStorage.setItem("vpm_history", JSON.stringify(newHist));
  };

  const runSearch = async () => {
    if (!file && !imageUrl) {
      alert("Please upload an image or paste an image URL.");
      return;
    }
    setLoading(true);
    setResults([]);
    setFiltered([]);
    setSelected(null);

    try {
      const form = new FormData();
      if (file) form.append("file", file);
      else form.append("image_url", imageUrl);

      const resp = await axios.post(BACKEND_SEARCH, form, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });

      const res = resp.data?.results || [];
      setResults(res);

      addToHistory({
        time: Date.now(),
        type: file ? "upload" : "url",
        value: file ? file.name : imageUrl,
      });

      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
    } catch (err) {
      console.error(err);
      alert("Search failed: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setFiltered([]);
    setPreview(null);
    setFile(null);
    setImageUrl("");
    setMinScore(0);
    setPage(1);
  };

  const rerunHistory = (h) => {
    if (h.type === "url") {
      setImageUrl(h.value);
      setPreview(h.value);
      setFile(null);
      setTimeout(() => runSearch(), 200);
    } else {
      alert("To re-run an upload item, please upload the same file again.");
    }
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const exportAsPDF = () => window.print();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* ✅ CLEAN PROFESSIONAL NAVBAR */}
        <header className="mb-8 border-b border-slate-200 pb-4">
          <div className="flex items-center justify-between">

            {/* Left: Logo + Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-md flex items-center justify-center font-semibold text-lg">
                V
              </div>

              <div>
                <h1 className="text-2xl font-semibold text-slate-800">
                  Visual Product Matcher
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  AI-powered visual similarity search
                </p>
              </div>
            </div>

            {/* Right: Backend Status */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Backend:</span>
              <span className="flex items-center gap-1 font-medium text-green-600">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                Running
              </span>
            </div>

          </div>
        </header>

        {/* Controls section */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Upload image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2 w-full" />

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700">Or paste image URL</label>
                <div className="flex gap-2 mt-2">
                  <input
                    value={imageUrl}
                    onChange={handleUrlChange}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 p-2 border border-slate-200 rounded-md"
                  />
                  <button
                    onClick={() => {
                      setImageUrl("https://picsum.photos/id/21/400/400");
                      setPreview("https://picsum.photos/id/21/400/400");
                    }}
                    className="px-3 py-2 bg-slate-100 rounded-md text-sm border"
                  >
                    Use test
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button onClick={runSearch} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60">
                  {loading ? "Searching..." : "Search"}
                </button>
                <button onClick={clearResults} className="px-3 py-2 border rounded-md text-sm">Clear</button>
                <button onClick={exportAsPDF} className="px-3 py-2 border rounded-md text-sm">Export</button>
                <div className="ml-auto text-sm text-slate-500">Matches: <span className="font-medium text-slate-700">{filtered.length}</span></div>
              </div>
            </div>

            <aside>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded">
                <div className="h-40 bg-white rounded overflow-hidden flex items-center justify-center">
                  {preview ? (
                    <img src={preview} alt="preview" className="object-contain max-h-full" />
                  ) : (
                    <div className="text-slate-400 text-sm">Preview will appear here</div>
                  )}
                </div>

                <div className="mt-4">
                  <div className="text-sm text-slate-600">Similarity filter</div>
                  <div className="flex items-center gap-3 mt-2">
                    <input type="range" min="0" max="100" value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} className="w-full" />
                    <div className="w-12 text-right text-sm font-medium text-slate-700">{minScore}%</div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-slate-700">Search History</h4>
                  <div className="mt-2 space-y-2 max-h-40 overflow-auto">
                    {history.length === 0 && <div className="text-xs text-slate-400">No history yet</div>}
                    {history.map((h, i) => (
                      <div key={i} className="flex items-center justify-between bg-white p-2 rounded shadow-sm">
                        <div className="text-xs truncate max-w-[160px]">
                          <div className="font-medium text-slate-700">{h.value}</div>
                          <div className="text-slate-400 text-xs">{new Date(h.time).toLocaleString()}</div>
                        </div>
                        <div>
                          <button onClick={() => rerunHistory(h)} className="px-2 py-1 text-xs border rounded-md">Run</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </aside>
          </div>
        </section>

        {/* Results */}
        <main ref={resultsRef} className="mt-8">
          {loading ? (
            <div className="flex justify-center py-20"><LoadingSpinner /></div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-800">Similar Products</h2>
                <div className="text-sm text-slate-500">{filtered.length} items matched</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {pageItems.map((p) => (
                  <div key={p.id} onClick={() => setSelected(p)} role="button" tabIndex={0}>
                    <ResultCard product={p} />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <Pagination page={page} total={totalPages} onChange={setPage} />
                <div className="text-sm text-slate-500">Page {page} of {totalPages}</div>
              </div>
            </>
          )}
        </main>

        {selected && (
          <Modal onClose={() => setSelected(null)}>
            <div className="p-4">
              <img src={selected.image_url || selected.image_path} alt={selected.name} className="w-full h-64 object-contain rounded" />
              <h3 className="text-xl font-semibold mt-3">{selected.name}</h3>
              <p className="text-sm text-slate-500">{selected.category}</p>
              <p className="mt-2 font-semibold">Similarity: {(selected.score * 100).toFixed(2)}%</p>
              <div className="mt-4 flex gap-2">
                <a href={selected.image_url || selected.image_path} target="_blank" rel="noreferrer" className="px-3 py-2 border rounded">Open</a>
                <button onClick={() => { navigator.clipboard.writeText(selected.image_url || selected.image_path); alert("Copied image URL"); }} className="px-3 py-2 border rounded">Copy URL</button>
              </div>
            </div>
          </Modal>
        )}

      </div>
    </div>
  );
}
