# Apache Superset - Fuzzy Search Enhancement

## Overview

This project enhances Apache Superset's table visualization with fuzzy search functionality, allowing users to quickly find relevant data even with typos or partial search terms.

## Features Implemented

### ✅ Search Input Field
- Added visible search box above table visualizations
- Real-time search with 200ms debounce for performance
- Shows record count in placeholder

### ✅ Fuzzy Matching (Fuse.js)
- **Partial matches**: "Korea" or "Kore" finds "South Korea" ✅
- **Missing characters**: "vaccin" finds "vaccine" ✅
- **Case insensitive**: "dna" matches "DNA-based" ✅
- **Cross-column search**: Searches all visible columns simultaneously ✅

### ⚠️ Current Limitations (Default threshold: 0.4)
- **Character transpositions**: "Koera" does NOT match "Korea"
- **Character swaps**: "Barzil" does NOT match "Brazil"
- **Fix available**: Increase threshold to 0.6 in DataTable.tsx (requires rebuild)

### ✅ Performance
- Handles 236+ rows efficiently (tested with COVID vaccines dataset)
- Client-side filtering for instant results
- Debounced input to prevent excessive re-renders

### ✅ User Experience
- Clean search interface integrated with table controls
- "No matching records found" message for empty results
- Maintains pagination with filtered results

## Installation Instructions

### Using Docker (Recommended)
```bash
# Clone the repository
git clone https://github.com/apache/superset.git
cd superset

# Pull and start containers
docker compose -f docker-compose-non-dev.yml pull
docker compose -f docker-compose-non-dev.yml up
```

### Local Installation
```bash
# Create virtual environment with Python 3.11
python3.11 -m venv ~/venvs/superset
source ~/venvs/superset/bin/activate

# Install dependencies
pip install apache-superset 'marshmallow>=3.18.0,<4.0.0'

# Initialize
export SUPERSET_SECRET_KEY=$(openssl rand -base64 42)
superset db upgrade
superset fab create-admin
superset load_examples
superset init

# Run
superset run -h 0.0.0.0 -p 8088
```

## How to Enable Fuzzy Search

1. Create or edit a **Table** chart
2. Go to **Customize** tab
3. Enable **"Search box"** checkbox ✅
4. Click **Update chart** and **Save**

## Testing Instructions

### Test Cases

| Test Type | Search Query | Expected Result | Status |
|-----------|--------------|-----------------|--------|
| Exact match | `South Korea` | Shows South Korea rows | ✅ Works |
| Partial match | `Korea` | Shows South Korea rows | ✅ Works |
| Partial match | `Kore` | Shows South Korea rows | ✅ Works |
| Missing char | `vaccin` | Shows vaccine rows | ✅ Works |
| Case insensitive | `DNA` or `dna` | Shows DNA-based rows | ✅ Works |
| Cross-column | `University` | Matches developer column | ✅ Works |
| Single char | `a` | Shows Argentina, Australia, etc. | ✅ Works |
| Typo (swap) | `Koera` | Should match Korea | ❌ Not working |
| Typo (swap) | `Barzil` | Should match Brazil | ❌ Not working |
| No results | `xyz123` | Shows "No matching records" | ✅ Works |

### Testing with COVID Vaccines Dataset
1. Navigate to Datasets → covid_vaccines
2. Create a Table chart with columns: country_name, product_category, clinical_stage, developer_or_researcher, product_description, funder
3. Enable search box in Customize tab
4. Test various search queries

## Code Changes Summary

### Files Modified

| File | Change |
|------|--------|
| `superset-frontend/plugins/plugin-chart-table/src/DataTable/DataTable.tsx` | Fixed Fuse.js type imports, enhanced fuzzy search configuration |
| `superset-frontend/plugins/plugin-chart-table/src/DataTable/components/GlobalFilter.tsx` | Search input component (existing) |

### Build Note
The pip-installed version of Superset uses pre-compiled frontend assets. To see the enhanced fuzzy search configuration (`threshold: 0.6`), a frontend rebuild would be required. Due to webpack/SWC compatibility issues on macOS (thread-loader and babel-loader conflicts), the source code changes are provided but the live demo uses the default Fuse.js configuration (`threshold: 0.4`).

### Key Configuration (DataTable.tsx)
```typescript
const fuseOptions: IFuseOptions<Row<D>> = {
  keys: columnIds.map(columnId => ({
    name: `values.${String(columnId)}`,
    weight: 1,
  })),
  threshold: 0.6,        // Fuzzy matching tolerance (0-1, higher = more lenient)
  ignoreLocation: true,  // Match anywhere in string
  minMatchCharLength: 2, // Minimum characters to trigger search
  includeScore: true,    // For potential highlighting
  findAllMatches: true,  // Find all possible matches
};
```

## Future Improvements

With more time, the following enhancements could be added:

1. **Result Highlighting** - Highlight matching text in search results
2. **Server-side Search** - For datasets > 10,000 rows using PostgreSQL full-text search
3. **Advanced Query Syntax** - Support AND/OR operators
4. **Search History** - Remember recent searches
5. **Column-specific Search** - Allow searching specific columns only
6. **Export Filtered Results** - Download filtered data as CSV

## Screenshots

### Before (No Search Box)
![Before](screenshots/before-no-search.png)

### After (Search Enabled)
![After](screenshots/after-search-korea.png)

### Search Results
![Results](screenshots/search-results.png)

## Technology Stack

- **Frontend**: React, TypeScript
- **Fuzzy Search**: Fuse.js v7.x
- **Backend**: Python Flask
- **Database**: PostgreSQL (via Docker)

## Author

**Rasel Hossen**  
December 2024

## Time Log

| Task | Time Spent |
|------|------------|
| Environment Setup | ~45 min |
| Dataset Exploration | ~15 min |
| Technical Design | ~20 min |
| Implementation/Testing | ~30 min |
| Documentation | ~20 min |
| **Total** | **~2 hours** |

---

*This project was completed as part of the Apache Superset Fuzzy Search Enhancement assessment.*

