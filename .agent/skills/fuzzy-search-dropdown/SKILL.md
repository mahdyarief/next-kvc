---
name: fuzzy-search-dropdown
description: >
  Patterns and procedures for implementing fuzzy search (typo-tolerant filtering) in Dropdown,
  Combobox, and Command components using Fuse.js. Use when building or enhancing a dropdown,
  combobox, select, or any searchable list component that filters client-side options.
  Triggers on: "fuzzy search", "combobox search", "dropdown filter", "fuse.js", "typo-tolerant search".
---

# Fuzzy Search in Dropdown & Combobox Components

This skill defines the standard pattern for adding **Fuse.js fuzzy search** to Dropdown, Combobox, and `cmdk`-based Command components in this project.

> **Scope**: Client-side, in-memory fuzzy search for **≤1000 options** in dropdowns and comboboxes.
> For full-text app-wide search (posts, products, users from DB), use MeiliSearch instead.

---

## 1. When to Use Fuse.js

| Scenario | Use Fuse.js? |
|---|---|
| Combobox with 10–1000 static/once-fetched options | ✅ Yes |
| Fetch ALL items once from server, cache with SWR, filter client-side | ✅ Yes — **Hybrid Pattern** |
| Server searches per keystroke (SWR key includes query) | ❌ No — server already filters |
| Bad word / string distance comparison | ❌ No — use `fastest-levenshtein` |
| App-wide full-text search (DB) | ❌ No — use MeiliSearch |
| Dropdown with <10 items | ❌ No — `cmdk` built-in filter is enough |

---

## 2. Installation

```bash
bun add fuse.js
```

TypeScript types are included in the package — no `@types/fuse.js` needed.

---

## 3. The `useFuzzySearch` Hook (SSOT)

**ALWAYS use this hook** rather than instantiating Fuse directly in components.
Location: `src/hooks/use-fuzzy-search.ts`

```typescript
// src/hooks/use-fuzzy-search.ts
'use client'

import Fuse, { type IFuseOptions } from 'fuse.js'
import { useMemo, useState } from 'react'

export interface FuzzySearchItem {
  label: string
  value: string
  [key: string]: unknown // Allow extra metadata
}

const DEFAULT_OPTIONS: IFuseOptions<FuzzySearchItem> = {
  keys: ['label'],        // Search by label by default
  threshold: 0.4,         // 0 = exact match, 1 = match anything; 0.4 is the sweet spot
  distance: 100,          // Max distance from the match location
  minMatchCharLength: 1,  // Minimum characters to trigger fuzzy match
  includeScore: false,    // Skip score for performance (enable only for ranking)
  shouldSort: true,       // Sort by best match first
}

/**
 * A memoized Fuse.js fuzzy search hook.
 * The Fuse index is only rebuilt when `items` reference changes.
 */
export function useFuzzySearch<T extends FuzzySearchItem>(
  items: T[],
  query: string,
  options?: IFuseOptions<T>,
): T[] {
  // Memoize fuse instance — only rebuilds when items list changes
  const fuse = useMemo(
    () => new Fuse(items, { ...DEFAULT_OPTIONS, ...options } as IFuseOptions<T>),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items],
  )

  return useMemo(() => {
    if (!query.trim()) return items // Empty query → show all
    return fuse.search(query).map((result) => result.item)
  }, [fuse, items, query])
}

/**
 * Controlled version: returns [query, setQuery, filteredItems]
 * Use this when you want to own the query state inside the hook.
 */
export function useFuzzyFilter<T extends FuzzySearchItem>(
  items: T[],
  options?: IFuseOptions<T>,
): [string, (q: string) => void, T[]] {
  const [query, setQuery] = useState('')
  const filtered = useFuzzySearch(items, query, options)
  return [query, setQuery, filtered]
}
```

### ⚠️ Critical: Stable `items` Reference

The Fuse index rebuilds only when `items` changes. To prevent needless rebuilds:

```typescript
// ❌ WRONG: New array on every render → Fuse rebuilds on every render
<MyCombobox options={data.map(d => ({ label: d.name, value: d.id }))} />

// ✅ CORRECT: Memoize the options array
const options = useMemo(
  () => data.map(d => ({ label: d.name, value: d.id })),
  [data]
)
<MyCombobox options={options} />
```

---

## 4. Integrating with the Project's `Combobox` Component

The project `Combobox` at `src/components/ui/floating/combobox.tsx` uses `cmdk` (`<Command>`).
`cmdk` has its own internal filter (substring). To use Fuse.js instead, **bypass cmdk's filter**
by passing `shouldFilter={false}` to `<Command>` and rendering your pre-filtered items.

### Pattern A: Enhanced `FuzzyCombobox` (Recommended)

Create a variant at `src/components/ui/floating/fuzzy-combobox.tsx`:

```typescript
'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FloatingLabel } from './label'
import { Badge } from '@/components/ui/badge'
import { useFuzzySearch } from '@/hooks/use-fuzzy-search'
import { useDebounce } from '@/hooks/use-debounce' // See Section 5

export interface FuzzyComboboxOption {
  label: string
  value: string
}

// ... (same Props interface as Combobox)

export function FuzzyCombobox({
  id,
  label,
  options,
  value,
  onValueChange,
  multiple,
  className,
  placeholder,
  emptyMessage = 'No options found.',
}: FuzzyComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const generatedId = React.useId()
  const finalId = id || generatedId

  // Debounce the search query (300ms) to avoid excessive re-renders
  const debouncedQuery = useDebounce(inputValue, 300)

  // Fuzzy filter options — Fuse index memoized, only query changes trigger re-filter
  const filteredOptions = useFuzzySearch(options, debouncedQuery)

  const handleSelect = (optionValue: string) => { /* same as Combobox */ }
  const isSelected = (optionValue: string) => { /* same as Combobox */ }
  const getSelectedLabels = () => { /* same as Combobox */ }

  return (
    <div className={cn('group relative w-full', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {/* same trigger as Combobox */}
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command
            shouldFilter={false}  // ← KEY: Disable cmdk's built-in filter
          >
            <CommandInput
              placeholder={`Search ${label.toLowerCase()}...`}
              value={inputValue}
              onValueChange={setInputValue} // ← controlled input
            />
            <CommandList className="max-h-[200px]">
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (  // ← render filtered results
                  <CommandItem
                    key={option.value}
                    value={option.value}             // ← use value not label
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        isSelected(option.value) ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FloatingLabel>{label}</FloatingLabel>
    </div>
  )
}
```

### Pattern B: Enhance Existing `Combobox` Inline

For quick one-off cases (NOT the standard), use `useFuzzyFilter` inline:

```typescript
const [query, setQuery, filteredOptions] = useFuzzyFilter(options)

// In JSX:
<Command shouldFilter={false}>
  <CommandInput value={query} onValueChange={setQuery} placeholder="Search..." />
  <CommandList>
    {filteredOptions.map(opt => <CommandItem key={opt.value} value={opt.value}>{opt.label}</CommandItem>)}
  </CommandList>
</Command>
```

---

## 5. Required: `useDebounce` Hook

Fuzzy search must be debounced to avoid re-filtering 10× per word typed.
Location: `src/hooks/use-debounce.ts`

```typescript
// src/hooks/use-debounce.ts
import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
```

---

## 6. Fuse.js Configuration Reference

```typescript
const FUSE_PRESETS = {
  // Standard dropdown (category, status, single-field)
  standard: {
    keys: ['label'],
    threshold: 0.4,
    distance: 100,
    minMatchCharLength: 1,
    shouldSort: true,
  },

  // Strict: only close matches (e.g., product codes, SKUs)
  strict: {
    keys: ['label', 'value'],
    threshold: 0.2,  // Lower = stricter
    distance: 50,
    minMatchCharLength: 2,
    shouldSort: true,
  },

  // Lenient: very forgiving (e.g., notes, descriptions)
  lenient: {
    keys: ['label'],
    threshold: 0.6,  // Higher = more results, more noise
    distance: 200,
    minMatchCharLength: 1,
    shouldSort: true,
  },

  // Multi-key: search by label AND a secondary field (e.g., email, code)
  multiKey: {
    keys: [
      { name: 'label', weight: 0.7 },
      { name: 'email', weight: 0.3 },
    ],
    threshold: 0.4,
    shouldSort: true,
  },
} as const
```

**Threshold guide:**
- `0.0` = Exact match only
- `0.2` = Very close (1 typo allowed in short words)
- `0.4` = **Recommended default** (1–2 typos, practical for most dropdowns)
- `0.6` = Lenient (might show unrelated results)
- `1.0` = Match anything

---

## 7. Patterns for Server-Fetched Data

There are two different scenarios when data comes from a server. Choose the right one:

---

### Pattern A: SWR Cache + Fuse.js (Hybrid) ✅

**Use when**: Fetching **ALL items** once (no search filter on server). SWR caches the full list, Fuse.js does all filtering client-side.

```
Fetch ALL (once) ──→ SWR cache (static key) ──→ Fuse.js fuzzy filter ──→ UI
                          ↑
                   Revalidates in background
                   No re-fetch per keystroke
```

```typescript
import useSWR from 'swr'
import { useFuzzySearch } from '@/hooks/use-fuzzy-search'
import { useDebounce } from '@/hooks/use-debounce'

export function HybridCombobox({ label }: { label: string }) {
  const [inputValue, setInputValue] = useState('')
  const debouncedQuery = useDebounce(inputValue, 300)

  // ✅ Static SWR key — NOT query-dependent
  // Fetches ALL items once, dedupes across all instances of this combobox
  const { data: allItems = [], isLoading } = useSWR(
    '/api/products/all',                         // ← NO query in the key
    () => fetch('/api/products/all').then(r => r.json()),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5 * 60 * 1000,           // Cache for 5 minutes
    }
  )

  // Memoize to prevent Fuse index rebuild
  const options = useMemo(
    () => allItems.map((item: any) => ({ label: item.name, value: item.id })),
    [allItems]
  )

  // ✅ Fuse.js filters the FULL cached list
  const filteredOptions = useFuzzySearch(options, debouncedQuery)

  return (
    <Command shouldFilter={false}>
      <CommandInput value={inputValue} onValueChange={setInputValue} />
      <CommandList>
        {isLoading
          ? <CommandEmpty>Loading...</CommandEmpty>
          : filteredOptions.map(opt => (
              <CommandItem key={opt.value} value={opt.value}>
                {opt.label}
              </CommandItem>
            ))
        }
      </CommandList>
    </Command>
  )
}
```

**When this fits:**

| Condition | Fits? |
|---|---|
| Dataset ≤1000 items | ✅ Perfect |
| Data changes infrequently (categories, users, configs) | ✅ Great |
| Multiple comboboxes needing the same list | ✅ SWR dedupes the single fetch |
| Dataset >5000 items | ❌ Memory pressure — use Pattern B |
| Data changes every second (live stock) | ❌ SWR stale risk |

---

### Pattern B: Per-Keystroke Server Search (NO Fuse.js)

**Use when**: Dataset is large (>1000 items) OR you need real-time server filtering. The server does the searching — Fuse.js would be redundant.

```typescript
export function ServerSearchCombobox({ endpoint }: { endpoint: string }) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 400)

  // ✅ Query IS in the SWR key — different key per search term
  const { data, isLoading } = useSWR(
    debouncedQuery.length >= 2 ? [endpoint, debouncedQuery] : null,
    ([url, q]) => fetch(`${url}?search=${q}`).then(r => r.json()),
    { revalidateOnFocus: false, dedupingInterval: 5000 }
  )

  // Render data.items directly — server already filtered them
  // ❌ Do NOT pass data.items through useFuzzySearch here
}
```

---

### The Critical Distinction

```typescript
// ✅ CORRECT — Hybrid: SWR key is STATIC, Fuse filters the full cache
const { data: allItems } = useSWR('/api/items/all', fetcher) // no query in key
const filtered = useFuzzySearch(allItems, debouncedQuery)    // Fuse as the only filter

// ❌ WRONG — Double-filter: SWR key has query (server searched) AND Fuse re-filters
const { data: serverResults } = useSWR(['/api/items', query], fetcher) // server searched!
const filtered = useFuzzySearch(serverResults, query) // Fuse re-filters already-filtered results
```

**The rule:** If your SWR key contains the search query → server is filtering → do NOT add Fuse.js.
If your SWR key is static → server returns ALL items → Fuse.js is the only filter → ✅ valid.

---

## 8. Anti-Patterns

### ❌ Instantiate Fuse inside render
```typescript
// BAD: Fuse index rebuilt on every render = slow
function MyComponent({ options }) {
  const results = new Fuse(options, config).search(query) // ← per render!
}
```

### ❌ Use cmdk's built-in filter AND Fuse.js simultaneously
```typescript
// BAD: cmdk filters first (substring), then Fuse runs on already-filtered subset
<Command>  {/* shouldFilter defaults to true */}
  {filteredOptions.map(...)} {/* cmdk also auto-filters these! */}
</Command>
```
**Always pass `shouldFilter={false}` to `<Command>` when using Fuse.js.**

### ❌ Filter without debounce
```typescript
// BAD: Re-filters on every keystroke (26+ times for a typical search)
const filtered = useFuzzySearch(options, inputValue) // no debounce
```

### ❌ Double-filter: Fuse.js on top of server-searched results
```typescript
// BAD: Server searched by query, then Fuse re-filters the already-filtered subset
// This means Fuse never sees items the server excluded — search quality degrades
const { data } = useSWR(['/api/items', query], fetcher) // query in key = server filters
const filtered = useFuzzySearch(data, query)             // ← WRONG: double-filter
```

---

## 9. Implementation Checklist

When adding fuzzy search to a combobox or dropdown:

- [ ] Install `fuse.js`: `bun add fuse.js`
- [ ] Create/verify `src/hooks/use-fuzzy-search.ts` exists
- [ ] Create/verify `src/hooks/use-debounce.ts` exists
- [ ] Use `useFuzzySearch(items, debouncedQuery)` — NOT `new Fuse()` directly
- [ ] Pass `shouldFilter={false}` to `<Command>` component
- [ ] Render `filteredOptions` (not raw `options`) in `<CommandItem>`
- [ ] Use `value={option.value}` (not `value={option.label}`) on `<CommandItem>` to prevent cmdk hijacking
- [ ] Options array is **memoized** at call site (`useMemo`) to prevent Fuse index rebuilds
- [ ] Threshold set to `0.4` unless there's a reason to change it
- [ ] For >1000 items or per-keystroke server results: use SWR pattern instead

---

## 10. File Locations Reference

```
src/
├── hooks/
│   ├── use-fuzzy-search.ts     ← SSOT for Fuse.js instantiation (create once)
│   └── use-debounce.ts         ← Shared debounce hook
└── components/
    └── ui/
        └── floating/
            ├── combobox.tsx        ← Original (cmdk only, no Fuse)
            └── fuzzy-combobox.tsx  ← Enhanced variant with Fuse.js
```
