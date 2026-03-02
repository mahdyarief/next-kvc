# Strategy Plan: Auth Theme Color Review & Contrast Fixes

## 🎯 Objective
Review and fix color usage on the Sign-In (Login) and Register pages, specifically focusing on dark theme contrast and premium "Midnight Obsidian" aesthetic.

## 🔍 Analysis
- **Problem**: The left branding panel on both Login and Register pages uses `bg-foreground`. In dark mode, `bg-foreground` flips to a light color (`oklch(0.92 0.01 255)`), while the content (text, icons, keyboard shortcuts) is hardcoded as `text-white` or `text-white/50`. This results in poor or zero contrast, making the text invisible.
- **Requirement**: The branding panel should always remain dark to maintain a high-contrast, premium "Midnight" feel, even if the user is in light mode. This provides a sophisticated "Dual Tone" look.

## 🏗️ Architectural Alignment (FBA-SOLID-SSOT)
- **FBA Alignment**: Changes are scoped within `src/features/auth` (represented by `src/app/auth` for routing).
- **SSOT Integrity**: Uses standardized OKLCH variables and Tailwind utilities.
- **Visual Consistency**: Aligns with the "Midnight Obsidian" theme defined in `globals.css`.

## 🏗️ Architecture Approach

### HI-LE Approach (Recommended)
- **Focus**: Minimum code change, maximum contrast impact.
- **Implementation**: 
  - Wrap the branding panel in a `.dark` class to force dark theme variables within its scope.
  - Use a fixed background color like `bg-zinc-950` or `oklch(var(--sidebar))` (which is dark) for the branding panel.
- **Benefit**: Ensures the branding side is *always* premium dark, regardless of the right-side form's theme.

### Full Approach
- **Focus**: Completely distinct themes for branding vs form.
- **Implementation**: Custom CSS variables for the branding panel that do not flip.
- **Cost**: Unnecessary complexity given Tailwind's current power.

## 🚀 Implementation Order
1.  **Refactor `src/app/auth/login/page.tsx`**:
    - Force the left branding panel to remain dark (using fixed color or forcing `.dark`).
    - Adjust the OKLCH mesh gradient for better visibility on dark backgrounds.
2.  **Refactor `src/app/auth/register/page.tsx`**:
    - Apply the same layout fixes.
    - Check the success state transitions and mobile backgrounds.

## 🧪 Testing
- **Manual Light Mode**: Verify the branding panel is dark and the form is light.
- **Manual Dark Mode**: Verify both panels are dark, but with distinct depth (Branding vs Background).
- **Responsive**: Ensure mobile layouts don't have overlapping light/dark artifacts.

## 📊 Success Criteria
- [ ] Branding panel text is perfectly legible in both light and dark modes.
- [ ] Visual hierarchy is preserved (Obsidian depth).
- [ ] No hardcoded colors that break contrast on theme switch.
