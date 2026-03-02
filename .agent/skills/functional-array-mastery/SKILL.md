---
name: functional-array-mastery
description: Procedures and patterns for high-performance functional array transformations. Focuses on flatMap, reduce, and advanced data normalization.
---

# Functional Array Mastery

This skill provides advanced patterns for manipulating and transforming data using functional array methods, specifically `flatMap`, to create clean, performant, and flat data structures.

## 1. When to Use `flatMap()`

`flatMap` is the ideal choice when:
- **Transformation results in an array per item**: (e.g., extracting multiple values from a single record).
- **Filtering while Mapping**: You want to modify a value and potentially remove it simultaneously.
- **Removing Null/Undefined values**: Instead of `.filter(Boolean).map(...)`, use `flatMap(v => v ? [mapper(v)] : [])`.
- **Handling API Response Data**: Flattening nested relationship arrays into a flat list for a UI component.

## 2. Patterns & Use Cases

### Normalizing Nested Documents
When fetching documentation categories with nested files, use `flatMap` to generate a flat list of all slugs for routing or search indexing.

```typescript
const allSlugs = categories.flatMap(cat => 
  cat.files.map(file => file.slug)
)
```

### Typo-Tolerant Search Indexing
Prepare search indexes by flattening several fields into a single array of searchable terms.

```typescript
const searchTerms = product.variants.flatMap(variant => [
  variant.sku,
  variant.color,
  product.name
])
```

### Recursive Flattening (Partial)
While standard `flatMap` only goes one level deep, it is often used as the base for building recursive flatteners.

```typescript
// Flattening items with child items
const getRecursiveItems = (items) => 
  items.flatMap(item => [
    item, 
    ...getRecursiveItems(item.children || [])
  ])
```

## 3. Comparison with `reduce()`

Use `flatMap()` when you want a **Flat List**. Use `reduce()` when you want a **Single Value/Object** (like a tally or a lookup map).

| Method | Best for... | Example |
| :--- | :--- | :--- |
| `flatMap` | Transforming List -> Flat List | Extraction, Filter/Map, Flattening |
| `reduce` | List -> Single Value or Lookup Map | Summarizing, Grouping, Object creation |

### Choosing `flatMap` over `reduce` for Lists
If the goal is to produce a list, `flatMap` is almost always more readable and less error-prone than manually managing an accumulator array in `reduce`.

```typescript
// ❌ MORE VERBOSE (Reduce)
const flat = items.reduce((acc, item) => [...acc, ...item.values], [])

// ✅ BETTER (flatMap)
const flat = items.flatMap(item => item.values)
```

## 4. Performance Context

`flatMap` is typically faster than `map().flat()` because it avoids the overhead of creating one or more intermediate arrays. This is especially true in React render loops (e.g., inside `useMemo`) where minimizing Total Blocking Time (TBT) is critical for a high Lighthouse score.
