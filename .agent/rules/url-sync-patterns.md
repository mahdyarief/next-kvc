---
trigger: always_on
glob: "**/*.{ts,tsx}"
---

# URL-Synced State: Next.js App Router Anti-Patterns

Rules for safely syncing React state with Next.js URL search parameters. Violations cause **infinite re-render loops** or silent stale-state bugs.

## 1. Never Put `searchParams` in a `useEffect` Dependency Array That Calls `router.push`

This is the most common infinite loop in Next.js App Router.

### ❌ FORBIDDEN — Infinite Loop
```tsx
useEffect(() => {
  const params = new URLSearchParams(searchParams.toString())
  params.set('search', debouncedSearch)
  router.push(`${pathname}?${params.toString()}`)
}, [debouncedSearch, searchParams]) // searchParams causes the loop!

// Why it loops:
// 1. debouncedSearch changes → effect runs → router.push fires
// 2. router.push changes URL → searchParams changes
// 3. searchParams change → effect re-runs → router.push fires again → ∞
```

### ✅ CORRECT — Diff-Guard Pattern
```tsx
useEffect(() => {
  // Guard: only push if the value actually differs from the URL
  const currentSearch = searchParams.get('search') || ''
  if (debouncedSearch === currentSearch) return

  const params = new URLSearchParams(searchParams.toString())
  if (debouncedSearch) {
    params.set('search', debouncedSearch)
  } else {
    params.delete('search')
  }
  params.set('page', '1')
  router.push(`${pathname}?${params.toString()}`, { scroll: false })
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [debouncedSearch]) // intentionally omit searchParams & router
```

**Key rules:**
1. Only include the **source value** (e.g., `debouncedSearch`) in deps, never the URL state it writes to.
2. Add a **diff-guard** at the top: compare the new value against the current URL param and `return` early if they match.
3. Add an `eslint-disable` comment explaining the intentional omission.

---

## 2. Never Use `isMounted` to Skip the First `useEffect` Run for URL Sync

`isMounted` refs break when the Server Component re-renders and passes new props, because the Client Component **remounts**, resetting the ref. This gives the illusion of working but fails in App Router.

### ❌ FORBIDDEN — Breaks on Re-mount
```tsx
const isMounted = useRef(false)

useEffect(() => {
  if (!isMounted.current) {
    isMounted.current = true
    return // This protection is lost on every server re-render
  }
  router.push(...)
}, [debouncedSearch, searchParams])
```

### ✅ CORRECT — Use the Diff-Guard Pattern Instead (see above)

---

## 3. Always Use `useTransition` for `router.push` Navigation

Wrapping `router.push` in `startTransition` tells React the navigation is non-urgent, keeping the current UI interactive while the server re-renders.

```tsx
const [isPending, startTransition] = useTransition()

const handleFilter = (value: string) => {
  startTransition(() => {
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  })
}

// Show pending state visually
<div className={`transition-opacity ${isPending ? 'opacity-60' : 'opacity-100'}`}>
  ...
</div>
```

---

## 4. Tab Navigation Must Update the URL to Enable Server-Side Data Isolation

When tabs control which data the **Server Component** fetches, tab switches **must** update the URL with a `?tab=` param. Client-side-only tab switching means the server always returns data for the default tab.

### ❌ BROKEN — Tabs switch visually but server always sees the default tab
```tsx
// Server Component — only fetches 'overview' data forever
const activeTab = searchParams.get('tab') || 'overview'

// Client — Tabs switch UI but never update the URL
<Tabs defaultValue={activeTab}>...</Tabs>
```

### ✅ CORRECT — Transitioned Tab Sync with Param Preservation
```tsx
'use client'
export function UrlSyncedTabs({ activeTab, children }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={(tab) => {
        // Guard: Prevent redundant navigation
        if (tab === activeTab) return

        // Preservation: Mantain search/filters, but reset page
        const params = new URLSearchParams(searchParams.toString())
        params.set('tab', tab)
        params.delete('page') 

        startTransition(() => {
          router.push(`${pathname}?${params.toString()}`, { scroll: false })
        })
      }}
    >
      <TabsList className={isPending ? 'opacity-60 transition-opacity' : ''}>
        ...
      </TabsList>
      {children}
    </Tabs>
  )
}
```

---

## 5. Tab-Isolated Data Fetching Pattern

For pages with tabs backed by a Server Component, only fetch data for the **active tab**:

```tsx
// ✅ Efficient — only queries DB for what's visible
if (activeTab === 'overview') {
  // lightweight count queries
} else if (activeTab === 'products') {
  // paginated product query with select projection
} else if (activeTab === 'settings') {
  // settings query
}

// ❌ Wasteful — fetches all data for all tabs on every render
const [products, types, batches] = await Promise.all([...all queries...])
```

---

## 6. Dormant Component Isolation (Preventing the "Sync-Back" Bug)

In tabbed or multi-view layouts, hidden Client Components that use `useSearchParams` can trigger redundant navigations if they remain mounted. They "react" to the parent's navigation and try to sync their own stale state back to the URL.

### ❌ WRONG: Hidden components stay reactive
```tsx
<TabsContent value="products">
  <ProductList queries={...} /> {/* Stays mounted while hidden! */}
</TabsContent>
```

### ✅ CORRECT: Conditional Unmounting
Always wrap tab content in a conditional check to ensure components are unmounted when inactive.
```tsx
<TabsContent value="products">
  {activeTab === 'products' && <ProductList queries={...} />}
</TabsContent>
```

---

## 7. Navigation Ref-Guards (Hardware Deduplication)

To prevent race conditions where multiple handlers (e.g., a tab change and a search debounce) trigger at the same time, use a `useRef` to deduplicate `router.push` calls.

### ✅ CORRECT — The Ref-Guard Pattern
```tsx
const lastNavigatedUrlRef = useRef<string | null>(null)

const navigate = (newUrl: string) => {
  if (lastNavigatedUrlRef.current === newUrl) return
  lastNavigatedUrlRef.current = newUrl
  
  startTransition(() => {
    router.push(newUrl, { scroll: false })
  })
}
```

---

## 8. Preventing the "Double-Hit" Bug (Urgent vs. Transitioned)

Next.js 15+ may trigger redundant RSC requests if multiple hooks react to an "urgent" URL change simultaneously.

### The Problem:
1. `router.push('/?tab=b')` fires an urgent navigation.
2. `useSearchParams()` reacts instantly, potentially triggering a `useEffect` sync.
3. The server receives two near-simultaneous requests for the same page.

### The Solution:
- **Always** use `useTransition` for component-driven navigation (Tabs, Selects, Buttons).
- **Always** use `URLSearchParams(searchParams.toString())` to avoid wiping context.
- **Always** add a value check (diff-guard) in the event handler itself to skip redundant calls.

---

## 9. Context Stewardship (Param Preservation)

Never use `new URLSearchParams()` for partial updates unless you explicitly intend to wipe the entire user context (search, filters, pagination). 

### ❌ WRONG: Wipes filters on tab switch
```tsx
const params = new URLSearchParams()
params.set('tab', newTab) // user's 'search=apple' is now LOST
```

### ✅ CORRECT: Preserves context
```tsx
const params = new URLSearchParams(searchParams.toString())
params.set('tab', newTab) // user's 'search=apple' is KEPT
params.delete('page')     // reset pagination as it's tab-specific
```

---

## 10. Native Routing vs. Component Fetching (GET vs. Server Action)

For simple data lists (Search, Filter, Sort), **always** use URL Sync (GET) instead of triggering a manual fetch via Server Action (POST).

### ❌ WRONG — Manual Fetching (POST hits to current page)
```tsx
// Inside Client Component
const handleFilter = async (type) => {
  setIsLoading(true)
  const data = await getFilteredData(type) // Server Action HIT #1 (POST)
  setData(data)
  setIsLoading(false)
}
```
**Why it fails:**
1. Triggers manual POST requests to the current page.
2. Filter state is lost on page refresh.
3. Not bookmarkable.
4. Breaks browser "Back" navigation.

### ✅ CORRECT — URL Syncing (GET hit with Params)
```tsx
// 1. page.tsx (Server Component) reads params
export default async function Page({ searchParams }) {
  const data = await getData(searchParams.type) // Standard GET
  return <ClientList initialData={data} />
}

// 2. ClientList.tsx (Client Component) pushes to URL
const handleFilter = (type) => {
  const params = new URLSearchParams(searchParams.toString())
  params.set('type', type)
  startTransition(() => {
    router.push(`${pathname}?${params.toString()}`)
  })
}
```
**Why it's the Standard:**
1. Uses Next.js's natural routing (standard GET requests).
2. Works perfectly with "Back" button and Refresh.
3. Allows Server-Side Pre-hydration (1-hit page load).
4. Bookmarkable filtered results.
