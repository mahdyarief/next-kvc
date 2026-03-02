# Vibe Blocks Registry

> [!IMPORTANT]
> This page is a summary of the Vibe Blocks skill. For the full, high-fidelity interactive showcase including the 2,000+ component catalog, please visit the **[Rich Vibe Blocks Showcase](/docs/vibe-blocks)**.

## Overview

**Vibe Blocks** is a proprietary component library built into this starter kit. It provides a massive collection of production-ready React components from two primary sources:

1.  **Relume Library (rl)**: ~1,500 semantic marketing sections.
2.  **Shadcn/Custom (cn)**: ~1,388 animation-rich dashboard and interactive components.

## How to Use

The library is indexed and searchable via the Agent's internal skill system. You can explore the catalog in two ways:

### 1. Interactive Showcase
Visit the **[Showcase Page](/docs/vibe-blocks)** to see a breakdown of categories and component counts.

### 2. Terminal Search
Run the search script directly in your project root to find specific sections:

```bash
# Search for all pricing tables
python .agent/skills/vibe-blocks/scripts/search.py "pricing table"

# Search only for animated heroes in the Shadcn library
python .agent/skills/vibe-blocks/scripts/search.py "hero" --source cn
```

## Category & Component Catalog

Below is the complete list of available categories and the number of components you can use from each source.

### 󰟀 Source: `cn` (Custom/Shadcn)
*Total Categories: 93 | Total Components: ~1,377*

| Category | Components | Category | Components | Category | Components |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `feature` | **262** | `hero` | **174** | `background-pattern`| **40** |
| `pricing` | **35** | `gallery` | **34** | `data-table` | **31** |
| `project` | **33** | `reference` | **33** | `testimonial` | **28** |
| `chart-card` | **27** | `cta` | **26** | `footer` | **25** |
| `projects` | **25** | `sidebar` | **21** | `blog` | **21** |
| `navbar` | **18** | `stats` | **18** | `about` | **17** |
| `contact` | **17** | `faq` | **16** | `chart-group` | **15** |
| `timeline` | **15** | `app-shell` | **14** | `aceternity` | **14** |
| `team` | **14** | `integration` | **13** | `download` | **12** |
| `logos` | **12** | `user-profile` | **12** | `shopping-cart` | **11** |
| `product-card` | **10** | `compare` | **10** | `signup` | **10** |
| `todo-list` | **10** | `shader` | **10** | `stats-card` | **10** |

---

### 󰟀 Source: `rl` (Relume Library)
*Total Categories: 51 | Total Components: ~1,525*

| Category | Components | Category | Components | Category | Components |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `layout` | **527** | `header` | **152** | `blog` | **68** |
| `stats` | **60** | `cta` | **58** | `multi-form` | **46** |
| `testimonial` | **43** | `event` | **37** | `content` | **32** |
| `contact` | **30** | `pricing` | **27** | `gallery` | **27** |
| `career` | **27** | `navbar` | **22** | `team` | **22** |
| `timeline` | **21** | `form` | **20** | `footer` | **17** |
| `onboarding` | **17** | `app-shell` | **16** | `banner` | **16** |
| `links` | **16** | `comparison` | **15** | `faq` | **14** |
| `portfolio` | **23** | `product` | **12** | `event-header` | **11** |
| `stacked-list` | **10** | `table` | **10** | `grid-list` | **10** |

## Why use Vibe Blocks?

- **Zero-JS Foundation**: Most sections are designed as Server Components first.
- **Hardware Accelerated**: Visual effects use CSS keyframes and GPU-driven animations.
- **FBA Ready**: Components are structured for modular placement in `src/features`.
- **Typo-Tolerant Search**: The internal search script uses fuzzy matching to find the right block every time.
