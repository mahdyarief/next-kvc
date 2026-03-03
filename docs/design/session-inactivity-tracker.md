# Strategy Plan: Client-Side Session Inactivity Tracker (Option C)

## 🎯 Objective
Automatically log out users who are truly inactive (no mouse, keyboard, or scroll activity) for a configured amount of time, seamlessly redirecting them to the login screen, all without overloading the server with polling requests.

## 🔍 Analysis
- NextAuth sessions are generally passive. They don't check for expiration until the user navigates or makes an API request.
- Pinging the server on every mouse movement is catastrophically inefficient.
- Local storage offers a highly performant, zero-network way to track and share activity timestamps across multiple browser tabs.

## 🏗️ Architectural Alignment (FBA-SOLID-SSOT)
- **FBA:** The hook will live in `src/features/auth/hooks/use-session-timeout.ts`.
- **SSOT:** The timeout duration and the local storage key will be centralized in `src/features/auth/constants.ts` (if it does not exist, we will create/add it).
- **SOLID (SRP):** The hook does *one thing*: it monitors DOM events, updates a timestamp, and checks against the current time. The `signOut` callback handles the rest.

## 🚀 Implementation Order

### Chunk 1: The Activity Watcher Hook `useSessionTimeout`
- Create `src/features/auth/hooks/use-session-timeout.ts`.
- It will bind throttled event listeners (`mousemove`, `keydown`, `scroll`, `touchstart`) to the `document` (only running client-side).
- On event fire: Update a `lastActivity` timestamp in `localStorage`.
- Create a `setInterval` that checks: `Date.now() - lastActivity > TIMEOUT_MS`.
- If true, call a provided clear/logout callback.

### Chunk 2: Integration & Global Mounting
- Update the global `Providers` component (`src/components/providers.tsx`) or an `AuthGuard` to wrap the application logic.
- The wrapper will execute `useSessionTimeout`, and pass NextAuth's `signOut({ callbackUrl: '/auth/sign-in' })` as the auto-logout action.

## 🧪 Testing Focus
- Open two tabs. Move mouse in Tab 1, wait 3 seconds. Check Tab 2; both should remain alive because they share `localStorage`.
- Wait the timeout duration across both tabs. The app should trigger `signOut` and redirect.

## 📊 Success Criteria
- [x] Zero network requests for activity updates.
- [x] NextAuth correctly destroys the session cookie.
- [x] Inactivity correctly leads to the login screen automatically.
