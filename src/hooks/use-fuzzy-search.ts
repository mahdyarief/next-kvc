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
