### Time Log (Approximate)

- **Environment setup & repository acquisition**: 20–30 minutes  
  - Downloaded Superset source, unpacked, and located the Table chart plugin / DataTable implementations.
- **Code analysis & design planning**: 25–35 minutes  
  - Reviewed `TableChart.tsx`, `DataTable.tsx`, and related types to identify the correct extension points for search and highlighting.
- **Fuzzy search implementation (Fuse.js)**: 35–45 minutes  
  - Replaced the existing global filter with a Fuse.js-based filter, tuned options for typo-tolerance and partial matches, and ensured server-side pagination remained unaffected.
- **Result highlighting & UX wiring**: 30–40 minutes  
  - Threaded search text through `TableChart`, added cell-level highlighting, and verified it plays well with existing formatting and totals recomputation.
- **Documentation (design doc, README, time log)**: 20–30 minutes  
  - Wrote the technical design, top-level README, and this time log.
- **Manual verification & lint checks**: 10–15 minutes  
  - Ran TypeScript/ESLint checks on the touched files and did a final review.

_Total: roughly 2.0–2.5 hours._
