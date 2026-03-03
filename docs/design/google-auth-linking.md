# Strategy Plan: Google Auth & Account Linking

## 🎯 Objective
Implement Google OAuth for authentication, allowing users to sign in via Google. Additionally:
- Provide a system-wide toggle in `SystemConfig` to enable/disable it dynamically.
- Support "Account Linking" so users who originally registered with an email/password can seamlessly log in with Google and access the same account without duplicates.

## 🔍 Analysis
- NextAuth.js supports Google out of the box, but blending it with `Credentials` (password) authentication requires specific database structures.
- To link Google to an existing user, NextAuth requires an `Account` model.
- Because a user might sign up exclusively via Google, the `User.password` field in the database must become optional (`String?`).
- We need to handle the `signIn` callback in `NextAuth` to automatically link a Google sign-in attempt to an existing email in the database.

## 🏗️ Architectural Alignment (FBA-SOLID-SSOT)
- **FBA Setup:** The core UI logic will sit in the existing `auth` feature folders, modifying `sign-in/page.tsx`.
- **SSOT Integrity:** `SystemConfig` inside `system.prisma` will be the single source of truth for "Is Google Auth Enabled?" 
- **Prisma Schema Modularization:** We will respect the current `prisma/schema/` structure. The `Account` model will be placed directly in `auth.prisma` or `user.prisma`.

## 🚀 Implementation Order

### Chunk 1: Database Migration
- Add `enableGoogleAuth Boolean @default(true)` to `SystemConfig` (`system.prisma`).
- Add the `Account` model for NextAuth OAuth tracking to `user.prisma`.
- Change `User.password` from `String` to `String?` so OAuth-only users can exist without a predefined password.
- Run `prisma db push` and `prisma generate`.

### Chunk 2: Auth.js Provider & Linking Logic
- Add `next-auth/providers/google` to `src/lib/auth.ts`.
- Integrate the `@auth/prisma-adapter` to automatically manage the `Account` linking.
- Ensure the `signIn` callback checks `SystemConfig.enableGoogleAuth`. If disabled, reject Google sign-ins.
- Enable `allowDangerousEmailAccountLinking: true` on the Google provider config so email/password users can "adopt" a Google login simply by clicking the Google button.

### Chunk 3: Frontend Integration
- Modify the `LoginForm` (`sign-in/page.tsx`) to render a "Sign in with Google" button.
- Make the button display conditionally based on the `SystemConfig` (either passing the config via a server action or checking it on layout).
- Handle the error state in case the system blocks an attempt or if there are conflicts.

## 🧪 Testing
- Toggle `enableGoogleAuth` to `false` in the DB and ensure the Google button either hides or rejects.
- Create an account with `test@example.com` + password. Then click "Sign in with Google" using `test@example.com` and ensure it connects to the same database row instead of creating a second user.

## 📊 Success Criteria
- [ ] Users can log in/out via Google.
- [ ] Old credentials accounts are seamlessly linked when using the same Google email.
- [ ] Global disable switch actively restricts Google authentication.
