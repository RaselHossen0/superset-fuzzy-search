# Technical Design Document: Fuzzy Search for Superset Table Charts

## Overview

This document outlines the implementation approach for adding fuzzy search functionality to Apache Superset's table visualizations, enabling users to quickly find relevant data even with typos or partial search terms.

## Problem Statement

Currently, Superset's table charts lack a unified search capability. Users can only:
- Sort columns by clicking headers
- Apply exact-match filters through the chart controls panel
- Use SQL-level WHERE clauses for data filtering

This creates friction when users need to quickly locate specific records in large datasets, especially when they don't know the exact spelling or full text of what they're searching for.

## Proposed Solution

### Technology Choice: Fuse.js

We will implement client-side fuzzy search using **Fuse.js** (https://fusejs.io/), a lightweight JavaScript library already included in Superset's dependencies. This choice offers several advantages:

1. **Zero backend changes required** - All processing happens in the browser
2. **Already integrated** - Fuse.js exists in `superset-frontend/package.json`
3. **Configurable fuzzy matching** - Supports threshold tuning, weighted search, and typo tolerance
4. **Fast performance** - Handles 1000+ rows efficiently with proper configuration

### Architecture Fit

The implementation will modify the following components:

```
superset-frontend/
├── plugins/
│   └── plugin-chart-table/
│       └── src/
│           └── DataTable/
│               ├── DataTable.tsx      # Main component (already has Fuse.js!)
│               └── components/
│                   └── GlobalFilter/  # Search input component
```

**Key Insight**: Superset's DataTable already includes Fuse.js integration in `DataTable.tsx` with a `useGlobalFilter` hook. Our task is to enhance and expose this functionality.

### Implementation Approach

1. **Search Input Field**: Add a visible search box above the table using the existing `GlobalFilter` component
2. **Fuzzy Configuration**: Configure Fuse.js with:
   - `threshold: 0.4` - Balance between strict and fuzzy matching
   - `ignoreLocation: true` - Match anywhere in the string
   - `minMatchCharLength: 2` - Avoid single-character noise
3. **Result Highlighting**: Implement text highlighting using Fuse.js match indices
4. **Debouncing**: Add 300ms debounce to prevent excessive re-renders during typing
5. **Performance**: Use React.useMemo for search results caching

## Challenges and Solutions

| Challenge | Solution |
|-----------|----------|
| Large datasets (10k+ rows) | Implement virtual scrolling + search result limiting |
| Multiple column search | Configure Fuse.js keys array with all visible columns |
| Performance on re-render | Memoize Fuse instance and search results |
| Highlighting accuracy | Use Fuse.js `includeMatches` option for precise indices |

## Success Criteria

- Search box visible and functional in table charts
- Typo tolerance: "vaccin" matches "vaccine"
- Partial matching: "Korea" matches "South Korea"
- Case insensitivity: "DNA" matches "dna-based"
- Sub-200ms response time for 1000 rows
- Visual highlighting of matched terms

## Future Enhancements

- Server-side search for datasets > 10,000 rows
- Search history and suggestions
- Advanced query syntax (AND/OR operators)
- Export filtered results

---

*Document prepared for Apache Superset Fuzzy Search Implementation*
*Author: Sarim Hassan*
*Date: December 2024*

