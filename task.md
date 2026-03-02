# Task: Review & Fix Auth Theme Color Contrast

Review color usage on dark theme for sign-in and register pages.

- [x] **Chunk 1: Login Page Color Contrast Fix** - COMPLETED
  - [x] Replace `bg-foreground` with a fixed obsidian dark color on the left panel.
  - [x] Wrap the left branding panel's content in a way that respects the dark theme.
  - [x] Adjust the OKLCH gradient for the left panel mesh.
  - **Test Instructions**: Check login page in both light and dark modes. Ensure left panel remains dark and text inside is white.
- [x] **Chunk 2: Register Page Color Contrast Fix** - COMPLETED
  - [x] Apply the same panel fix to the registration page.
  - [x] Audit the success state for dark mode (it currently uses `bg-mesh-gold`).
  - [x] Ensure mobile logo has proper contrast against the gold background on mobile.
  - **Test Instructions**: Check register page in both modes. Fill out form and check account creation success screen.
