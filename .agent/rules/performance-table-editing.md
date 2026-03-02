---
trigger: always_on
glob: "**/components/**"
---

# Performance: High-Density Editable Tables

When building tables with many editable cells (e.g., Price Batch Editor, Inventory Adjustment), follow these patterns to ensure 60fps responsiveness and zero input lag.

## 1. Decoupled Draft State (useRef + useState)
Never rely solely on a global `useState` array to hold draft edits. Updating a large state object on every keystroke or blur causes expensive full-table re-renders.

### The Pattern:
- Use `useRef` for the "source of truth" of edits (the `draftRef`).
- Use `useState` (or `setDraftPrices`) only to trigger a re-render when a cell *commits* its value, but minimize the dependency.
- Decouple `fetchData` from the draft state so that background refreshes don't wipe out local edits.

```typescript
const draftRef = useRef<Record<string, number>>({})
const [drafts, setDrafts] = useState<Record<string, number>>({}) // Optional: for UI feedback

const updateData = useCallback((rowIdx, colId, value) => {
  // 1. Update the Ref immediately (Zero lag)
  draftRef.current[rowId] = value
  
  // 2. Perform a partial state update if needed for UI feedback
  setDrafts(prev => ({ ...prev, [rowId]: value }))
  
  // 3. Update the local row data for display
  setData(old => old.map(...))
}, [])
```

## 2. Memoized Cell Components
Ensure cell components (especially `EditableCell`) are memoized or use stable callbacks.
- Pass `updateData` via a `meta` object in `@tanstack/react-table`.
- Memoize the `updateData` function in the parent hook to prevent the entire table from re-declaring its cell handlers on every edit.
- Use `React.memo` or `useMemo` for complex cells to prevent parent-driven re-renders when only sibling data changes.

## 3. Optimistic Merging & Reverting State
When server data is re-fetched (e.g., after pagination or search), the local `fetchData` logic must "overlay" the `draftRef` on top of the fresh server data.
- Row `batchPrice` = `draftRef.current[id] ?? serverPrice`
- This ensures user input is never lost during background synchronization.

**CRITICAL: Reverting / Cancelling Edits**
If you implement a "Cancel Edit" button that reverts the data back to its baseline, you MUST provide a `resetTableData` mechanism that explicitly flushes the `draftRef` *before* rewriting the data state. Otherwise, the "ghost edits" in the `draftRef` will immediately re-apply themselves over the reverted data.

```typescript
const resetTableData = useCallback((newData: OrderItemTableRow[]) => {
  draftRef.current = {} // 💥 Flush the pending queue to prevent ghost-edits
  setData(newData)
}, [])
```

## 4. Debounced Search
Always use debounced search (400ms+) for table filtering to prevent high-frequency layout shifts and redundant API calls.

## 5. Summary Table Metadata
Use functional updates `setData(old => ...)` inside `updateData` to avoid closure staleness and ensure that "Total" or "Count" fields remain accurate without requiring a full effect loop.

## 6. Efficient Dirty State Detection (No Changes to Save)
To prevent redundant API calls and provide immediate user feedback, implement an "Early Exit" save pattern by comparing current state to the initial server state.

### The Pattern:
1.  **Store Initial State**: Use `useRef` (e.g., `initialStateRef`) to capture the state immediately after `fetchData` finishes.
2.  **Capture Edits**: Use a `draftRef` (e.g., `draftPricesRef`) to track per-cell edits.
3.  **Compare on Save**: In `handleSave`, check both the `draftRef` length and compare static fields (like dates or headers) against the `initialStateRef`.

```typescript
const initialStateRef = useRef<{ start: string; end?: string | null } | null>(null)
const draftRef = useRef<Record<string, number>>({})

// During fetchData:
const result = await getData(...)
initialStateRef.current = { start: result.start, end: result.end }

// During handleSave:
const currentDates = { start: startDate.toISOString(), end: endDate?.toISOString() }
const datesChanged = !initialStateRef.current || 
                    initialStateRef.current.start !== currentDates.start ||
                    initialStateRef.current.end !== currentDates.end

const hasEdits = Object.keys(draftRef.current).length > 0

if (!hasEdits && !datesChanged) {
  toast.info('No changes to save')
  return
}
```
