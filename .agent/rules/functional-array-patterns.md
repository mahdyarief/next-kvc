---
trigger: always_on
glob: "**/*.{ts,tsx}"
---

# Functional Array Best Practices: flatMap

To ensure high-performance and clean code, follow these patterns when manipulating arrays. Prefer modern, functional methods over procedural loops or chained intermediate arrays.

## 1. Prefer `flatMap()` over `map().flat()`
Always use `flatMap` instead of calling `map` then `flat`. It is more concise and significantly more performant as it performs both operations in a single pass.

### ✅ CORRECT
```typescript
const ids = groups.flatMap(group => group.items.map(item => item.id))
```

### ❌ WRONG
```typescript
const ids = groups.map(group => group.items.map(item => item.id)).flat()
```

## 2. Use `flatMap()` for "Filter & Map" in ONE pass
When you need to perform a filter AND a transformation, `flatMap` is more efficient than chaining `.filter().map()` because it avoids creating an intermediate array.

### ✅ CORRECT (Single Pass)
```typescript
// If the mapper returns an empty array [], it effectively "filters" the item out
const activeUsers = users.flatMap(user => 
  user.isActive ? [transformUser(user)] : []
)
```

### ❌ WRONG (Double Pass)
```typescript
const activeUsers = users
  .filter(user => user.isActive)
  .map(user => transformUser(user))
```

## 3. Extracting Nested Values
Use `flatMap` to flatten nested arrays within objects for clean, one-level data structures.

### ✅ CORRECT
```typescript
const allTags = posts.flatMap(post => post.tags)
```

### ❌ WRONG (Indentation/Procedural)
```typescript
const allTags = []
posts.forEach(post => {
  post.tags.forEach(tag => allTags.push(tag))
})
```

## 4. Performance Context
- **Small Arrays (< 1000 items)**: The difference is negligible for runtime but `flatMap` is cleaner.
- **Large Arrays**: `flatMap` prevents memory pressure from intermediate array allocations.
- **Hydration Safety**: If calculating derived data during render, avoid multiple iterations to minimize TBT (Total Blocking Time).
