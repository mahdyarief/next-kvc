---
trigger: always_on
description: "Prevent redundant data fetching in interactive search/combobox/popover components. Use when building or reviewing components that fetch data on open/search."
glob: "src/**/*"
---

# Client Data Fetching Robustness

Prevent redundant network requests, "loading" flashes, and infinite fetch loops in interactive data-fetching components and pages.

## 1. The Problem: Fetch-On-Every-Open

A common anti-pattern is fetching data every time a dropdown opens, even when the search query hasn't changed. This causes:
- A visible "Loading..." flash on every interaction.
- Wasted network bandwidth and server load.
- Poor perceived performance and user frustration.

### ❌ WRONG: Fetch fires on every open
```tsx
React.useEffect(() => {
  if (!open) return

  const fetchOptions = async () => {
    setLoading(true)
    const results = await searchProducts(debouncedQuery)
    setOptions(results)
    setLoading(false)
  }
  fetchOptions()
}, [debouncedQuery, open]) // `open` toggling always triggers a new fetch
```

## 2. The Solution: Ref-Based Parameter Tracking

Use a `useRef` to store the parameters of the last successful fetch. Only trigger a new fetch if the parameters have actually changed.

### ✅ CORRECT: Cached results, fetch only on parameter change
```tsx
const lastFetchedParams = React.useRef<{
  query: string
  page: number
  filterIds?: string[]
} | null>(null)

React.useEffect(() => {
  if (isDropdown && !open) return

  // Check if parameters match last successful fetch
  const paramsChanged =
    !lastFetchedParams.current ||
    lastFetchedParams.current.query !== debouncedQuery ||
    lastFetchedParams.current.page !== pagination.pageIndex ||
    JSON.stringify(lastFetchedParams.current.filterIds) !== JSON.stringify(filterIds)

  // Skip if parameters haven't changed (prevents mount-unmount-mount double-fetching)
  if (!paramsChanged && data.length > 0) return

  const fetchData = async () => {
    const currentParams = { query: debouncedQuery, page: pagination.pageIndex, filterIds }
    
    // CRITICAL: Update the ref BEFORE the async call to "lock" this fetch.
    // This prevents race conditions during React "double-mounting" or re-renders 
    // that occur before the first fetch resolves.
    lastFetchedParams.current = currentParams

    setLoading(true)
    try {
      const results = await fetchAction(currentParams.query, currentParams.page, currentParams.filterIds)
      setData(results)
    } finally {
      setLoading(false)
    }
  }
  fetchData()
}, [debouncedQuery, open, filterIds, pagination.pageIndex])
```

## 3. The Server-Side Pre-hydration Pattern (Multi-Hit Elimination)

A client-side `useEffect` for the initial page data causes at least **2 hits** (RSC Data + Client Fetch). This is inefficient for primary page content.

### ❌ WRONG: Page triggers own data fetch on mount
```tsx
// page.tsx (Client Component)
export default function MyPage() {
  const [data, setData] = useState([])
  useEffect(() => { fetch('/api/data').then(setData) }, []) // Causes hit #2
  return <Table data={data} />
}
```

### ✅ CORRECT: Server Component Pre-fetches Data
```tsx
// page.tsx (Server Component)
export default async function MyPage() {
  const initialData = await getMyData() // Fetched on server
  return <MyPageForm initialData={initialData} /> // Passed to client leaf
}

// MyPageForm.tsx (Client Component)
export function MyPageForm({ initialData }) {
  // 1. Initialize state with server data
  const [data, setData] = useState(initialData)
  
  // 2. Initialize the fetch-ref with server parameters to block hit #2
  const lastFetchedParams = useRef({ page: 1, search: '' }) 
  
  // 3. fetcher will now only fire when parameters actually change from initial
  const fetchData = useCallback(...) 
}
```

## 4. The Pagination Reset Trap

When a search query or filter changes, we typically reset the page index to `0`. If not guarded, this creates a state-change loop that triggers double fetches on mount or search updates.

### ❌ WRONG: Unconditional reset triggers redundant re-render
```tsx
useEffect(() => {
  // Creating a new object { ...prev, pageIndex: 0 } triggers an effect update 
  // even if pageIndex was already 0.
  setPagination(prev => ({ ...prev, pageIndex: 0 }))
}, [debouncedSearch, selectedType])
```

### ✅ CORRECT: Identity-guarded reset
```tsx
useEffect(() => {
  setPagination(prev => {
    if (prev.pageIndex === 0) return prev // Identity check prevents redundant update
    return { ...prev, pageIndex: 0 }
  })
}, [debouncedSearch, selectedType])
```

## Key Rules

1. **Never clear options on close** — keep loaded data for instant re-open
2. **Track fetch parameters, not `open`** — ref stores `query + page + filterIds`
3. **Identity-guard resets** — never update state to its current value
4. **Remount Resilient** — ref-based tracking guards against Strict Mode double-mount
5. **Debounce queries** — 300-400ms to prevent rapid-fire requests
6. **Server pre-hydration** — fetch first page on server, pass as `initialData`
7. **Ref-Lock BEFORE fetch** — update ref immediately before async call

## Applicability Checklist

Apply to ANY component that:
- [ ] Fetches data when a Popover/Command/Combobox opens
- [ ] Uses a search input for server-side filtering
- [ ] Sits inside a table row (N instances = N redundant fetches)
- [ ] Serves as a primary page view with data-entry or table displays

## 7. Advanced: Cross-Instance Caching (SWR Standard)

For components rendered in multiple places (e.g., `ProductSearchCell` in every table row), shared caching is **mandatory** to prevent N+1 network requests for the same query.

### ✅ CORRECT: Shared SWR Cache
```tsx
import useSWR from 'swr'

export function SearchCell({ query, filterIds, open }) {
  // 1. Use a stable array-based key for deep comparison
  const key = open ? ['products-search', query, filterIds] : null
  
  // 2. SWR automatically dedupes concurrent requests and shares the result
  const { data, isLoading } = useSWR(
    key,
    ([_, q, f]) => fetchAction(q, f),
    {
      revalidateOnFocus: false, // Prevents flash on window focus
      dedupingInterval: 5000,   // Cache result for 5 seconds
    }
  )

  const options = data || []
  const loading = isLoading
  // ...
}
```

**Why SWR is the Standard:**
- **Request Deduping**: 5 rows same query → 1 network request
- **Instant Feedback**: Re-open resolves instantly from local cache
- **Boilerplate Reduction**: SWR handles caching, revalidation, loading states

## 8. Client-Side Fuzzy Search (Fuse.js) for Dropdowns & Comboboxes

For dropdowns and comboboxes with **pre-loaded options (≤1000 items)**, use **Fuse.js** for typo-tolerant fuzzy filtering. This eliminates the need for a server round-trip on every keystroke.

### Search Tool Decision Matrix

| Scenario | Tool |
|---|---|
| Dropdown/Combobox with pre-loaded options (≤1000 items) | **Fuse.js** ✅ |
| Server-side search (new fetch per keystroke) | SWR + server filter |
| App-wide full-text search (DB: posts, products) | MeiliSearch |
| Bad word / string distance comparison | `fastest-levenshtein` |
| Dropdown with <10 items | `cmdk` built-in filter (no extra library) |

### Mandatory: `useFuzzySearch` Hook as SSOT

NEVER instantiate `new Fuse()` directly in a component. Always use the shared hook at `src/hooks/use-fuzzy-search.ts`:

```typescript
// Key signature — see fuzzy-search-dropdown skill for full implementation
export function useFuzzySearch<T extends FuzzySearchItem>(
  items: T[],
  query: string,
  options?: IFuseOptions<T>,
): T[] { ... }
// threshold: 0.4 (sweet spot), memoized Fuse instance, debounce query before passing
```

### Mandatory: Disable `cmdk` Built-In Filter

The project's `<Command>` component (from `cmdk`) has its **own substring filter enabled by default**. When using Fuse.js, you MUST disable it to avoid double-filtering:

```tsx
// ❌ WRONG: cmdk filters AND Fuse filters — results are incorrect
<Command>
  {filteredOptions.map(...)}
</Command>

// ✅ CORRECT: Disable cmdk filter, let Fuse control filtering
<Command shouldFilter={false}>
  <CommandInput value={inputValue} onValueChange={setInputValue} />
  <CommandList>
    {filteredOptions.map(opt => (
      <CommandItem key={opt.value} value={opt.value}> {/* value= not label= */}
        {opt.label}
      </CommandItem>
    ))}
  </CommandList>
</Command>
```

**Use `value={option.value}` (not `value={option.label}`) on `<CommandItem>`** — cmdk uses the `value` prop for internal deduplication; using label causes conflicts when labels contain spaces or special characters.

### Integration Pattern

```tsx
'use client'
import { useState } from 'react'
import { useDebounce } from '@/hooks/use-debounce'
import { useFuzzySearch } from '@/hooks/use-fuzzy-search'

export function FuzzyCombobox({ options, ... }) {
  const [inputValue, setInputValue] = useState('')
  const debouncedQuery = useDebounce(inputValue, 300)  // Always debounce

  // Fuse index memoized — only rebuilds if `options` reference changes
  const filteredOptions = useFuzzySearch(options, debouncedQuery)

  return (
    <Command shouldFilter={false}>  {/* ← disable cmdk's built-in filter */}
      <CommandInput value={inputValue} onValueChange={setInputValue} />
      <CommandList>
        {filteredOptions.map(opt => (
          <CommandItem key={opt.value} value={opt.value} onSelect={...}>
            {opt.label}
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  )
}
```

### Critical: Stable Options Reference

The Fuse index ONLY rebuilds when the `items` array reference changes. Prevent needless rebuilds:

```typescript
// ❌ WRONG: New array on every render → Fuse rebuilds on every render
<FuzzyCombobox options={data.map(d => ({ label: d.name, value: d.id }))} />

// ✅ CORRECT: Memoize at the call site
const options = useMemo(
  () => data.map(d => ({ label: d.name, value: d.id })),
  [data]
)
<FuzzyCombobox options={options} />
```

### SWR + Fuse.js Hybrid Pattern ✅

You **CAN** combine SWR and Fuse.js when the SWR key is **static** (fetches ALL items, no query filter on server):

```typescript
// ✅ CORRECT — Static SWR key fetches all items; Fuse.js is the only filter
const { data: allItems = [] } = useSWR(
  '/api/products/all',    // ← NO query in key; server returns everything
  fetcher,
  { revalidateOnFocus: false, dedupingInterval: 5 * 60 * 1000 }
)
const options = useMemo(() => allItems.map(toOption), [allItems])
const filtered = useFuzzySearch(options, debouncedQuery)  // Fuse is the only filter ✅
```

This is valid when: dataset ≤1000 items, data changes infrequently, multiple components share the same list (SWR dedupes the single fetch).

### Anti-Patterns

```typescript
// ❌ Instantiate Fuse inside render — rebuilds on every keystroke
const results = new Fuse(options, config).search(query)

// ❌ Double-filter: SWR key includes query (server searched) AND Fuse re-filters
// Server already filtered — Fuse only sees a partial subset, degrading search quality
const { data } = useSWR(['/api/items', query], fetcher) // query in key → server filtered
const filtered = useFuzzySearch(data, query)             // ← WRONG: double-filter

// ❌ No debounce — re-filters 10+ times per word typed
const filtered = useFuzzySearch(options, inputValue) // raw, not debounced
```

**The rule:** SWR key has query → server filters → do NOT add Fuse.js.
SWR key is static → server returns ALL → Fuse.js is the only filter → ✅ valid.

> **Full reference**: See the [`fuzzy-search-dropdown`](./../skills/fuzzy-search-dropdown/SKILL.md) skill for complete implementation code, `FuzzyCombobox` component template, Fuse.js threshold guide, and the `useFuzzyFilter` controlled variant.
