# Strategy Plan: Refactor to Basic Application Template

## 🎯 Objective
Transform the current `NEXT-KVC` codebase from a WhatsApp-centric application into a general-purpose "Basic Application Template" or "Starter Kit".
- Retain core identity (Auth, User Management, Theme, Dashboard Shell).
- Retain Notifications feature.
- Remove all WhatsApp-specific functionality (Baileys integration, WhatsApp Features, Sessions, etc.).
- Clean up the Database Schema.
- Provide a clean, extensible starter for new projects using the current tech stack (Next.js 15+, Prisma, SQLite/Postgres, Tailwind 4, Shadcn).

## 🔍 Analysis
The current codebase is a heavily integrated WhatsApp management tool. WhatsApp features are present in:
1. **Prisma Schema**: `Session`, `Contact`, `Message`, `Group`, `AutoReply`, `Story`, `ScheduledMessage`, `AuthState`, `BotConfig`, `Label`, `ChatLabel`.
2. **Features Folder**: `src/features/whatsapp` (Baileys logic), `src/features/chat` (WhatsApp UI).
3. **API Routes**: `src/app/api/chats`, `api/messages`, `api/sessions`, `api/webhooks`, etc.
4. **Dashboard UI**: Sidebar nav items, Dashboard overview cards, WhatsApp-specific pages.
5. **Server Entry**: `src/server/index.ts` initializes `waManager`.

### 🏗️ Architectural Alignment (FBA-SOLID-SSOT)
- **FBA Alignment**: Remove `whatsapp` and `chat` feature folders. Keep `auth`, `dashboard`, and potentially extract `notifications` into its own feature folder if not already.
- **SSOT Integrity**: Clean up `navGroups` and database schema to reflect a generic application.
- **DIP**: Ensure the remaining notifications system doesn't depend on WhatsApp-specific logic.

## 🏗️ Architecture Approach

### Option A: HILE (High Impact, Low Effort) - RECOMMENDED
- **Focus**: Remove the most visible and heavy WhatsApp components while keeping the core shell intact.
- **Steps**:
    1.  Delete `src/features/whatsapp` and `src/features/chat`.
    2.  Purge WhatsApp models from `prisma/schema.prisma`.
    3.  Clean up `src/server/index.ts` (remove Baileys initialization).
    4.  Update `SidebarNav` to remove WhatsApp links.
    5.  Clean up `package.json` dependencies.
- **Why it's HILE**: Rapidly transforms the app into a clean slate without a full rewrite.

### Option B: Deep Cleaning & Generic Refactor
- **Focus**: Renaming the entire project, updating all metadata, and potentially swapping Baileys-based Socket.IO events for a more generic event system.
- **Cost**: Higher effort, similar functional outcome to Option A.

## 🚀 Implementation Order
1.  **Preparation**: Backup current state (User should do this).
2.  **Prisma Cleanup**: Simplify schema to keep only `User`, `SystemConfig`, and `Notification`.
3.  **Feature Deletion**: Remove WhatsApp and Chat logic folders.
4.  **API Purge**: Delete WhatsApp-related API routes.
5.  **UI Cleanup**: Refactor Dashboard, Sidebar, and App Shell.
6.  **Dependency Cleanup**: Remove unused packages like `@whiskeysockets/baileys`.
7.  **Final Polish**: Update README and project metadata.

## 🧪 Testing
- Verify successful Prisma migration/generation.
- Verify App starts with `bun run dev`.
- Verify Login/Register still works.
- Verify Notifications can be sent and received (via API or Manual UI).
- Verify Dashboard shell looks correct without WhatsApp errors.

## 📊 Success Criteria
- Zero "Baileys" or "WhatsApp" references in the core business logic.
- A functional Dashboard with User Management and Notifications.
- Clean code following FBA-SOLID-SSOT.
