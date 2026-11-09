# Hollow Ink — Comprehensive Project Context & Architecture Documentation

## 1. Project Overview & Primary Objective

**Product Name:** Hollow Ink  
**Production Reference:** https://hollow-link.vercel.app/  
**Workspace Directory:** `e:\HollowLink`  
**Application Directory:** `e:\HollowLink\horror-blog-react`  
**Category:** Digital storytelling, regional folklore, and South Asian Gothic literature platform  

The objective of this project was to extend the original Hollow Ink horror blog into a fully functional multi-role platform (Visitor, Reader, Writer/Author, and Administrator) while strictly preserving the visual atmosphere, brand identity, color tokens, and delicate typography of the original website.

---

## 2. Technology Stack & Design System

### Technology Stack
- **Frontend Framework:** React 18.2.0
- **Routing:** React Router DOM v6.20.0
- **Styling:** Tailwind CSS 3.3.0 + PostCSS + Autoprefixer
- **Tooling:** Create React App (`react-scripts 5.0.1`)
- **Database / Cloud SDK:** `@supabase/supabase-js` (with dual-mode fallback)
- **Local Persistence:** Reactive client-side relational storage engine with cross-tab custom event dispatching

### Typography Tokens
- `font-display`: `"Cinzel Decorative", serif` — Brand logo (`HOLLOWINK`) and primary section titles
- `font-heading`: `Cinzel, serif` — Navigation labels, category tags, card headings, buttons, and uppercase tracking
- `font-body`: `"Cormorant Garamond", serif` — Story excerpts, long-form prose, and article reading body

### Color Palette Tokens
- **Base Background:** `#08090b` (`bg-bg-base`)
- **Surface Background:** `#0e1013` (`bg-bg-surface`)
- **Raised Panels:** `#141820` (`bg-bg-raised`)
- **Hover State:** `#1a1f2b` (`bg-bg-hover`)
- **Primary Text:** `#c9b99a` (`text-text-primary`) — Warm parchment
- **Secondary Text:** `#7a7060` (`text-text-secondary`) — Muted antique bronze
- **Muted Text:** `#4a4540` (`text-text-muted`) — Weathered charcoal
- **Blood Accent:** `#9b2424` (`accent-blood`) & `rgba(155, 36, 36, 0.15)` (`accent-blood-dim`)
- **Gold Accent:** `#c9a84c` (`accent-gold`) & `rgba(201, 168, 76, 0.12)` (`accent-gold-dim`)
- **Border Hairline:** `rgba(201, 168, 76, 0.1)` (`border-border`)

### Signature Visual Effects
- Fractal noise SVG grain overlay applied via `body::after`
- `.text-shadow-glow`: Atmospheric crimson back-glow
- Keyframe animations: `fadeDown`, `mistPulse`, `arrowPulse`, and `pageIn`

---

## 3. Data Architecture & Services Layer

All UI components interact with the platform strictly via the service layer located in `src/services/`. This architectural boundary ensures storage independence and seamless migration between local storage and live cloud databases.

| File | Purpose |
|---|---|
| `src/data/seedData.js` | Pre-seeded with authentic South Asian Gothic stories (*The Weaver of Silent Threads*, *The Last Tide of Sundarban*, etc.), sample authors, readers, and moderation submissions. |
| `src/services/storage.js` | Manages localStorage serialization, initial hydration, and reactive event notifications (`hollowink_storage_update`). |
| `src/services/supabase.js` | Initializes the Supabase client when environment variables are detected; exports `isSupabaseConfigured`. |
| `src/services/authService.js` | Authentication engine supporting email/password sign-in, reader and writer registration, profile updates, password resets, and testing persona switching. |
| `src/services/storyService.js` | Story CRUD, multi-dimensional filtering, dynamic featured story selection, reading time calculation, views counter, and reaction toggling. Dual-mode support for Supabase mirroring. |
| `src/services/bookmarkService.js` | Manages saved reading lists with dual tabs: `to_read` and `favorites`. |
| `src/services/historyService.js` | Automatically tracks stories opened, last read timestamps, and scroll progress percentage. |
| `src/services/moderationService.js` | Moderation queue for submitted manuscripts, approval, rejection, revision requests with notes, moderation audit logging, and **CSV Ledger Export**. |
| `src/services/analyticsService.js` | Computes live platform and writer metrics dynamically from actual stored records (no hardcoded statistics) and provides system health diagnostics. |
| `src/context/AuthContext.jsx` | Global React context providing `user`, `role`, `login`, `register`, `logout`, and persona switching. |
| `src/components/ProtectedRoute.jsx` | Route guard restricting access to authenticated users based on role permissions (`reader`, `writer`, `admin`). |

---

## 4. Implemented Pages & Workflows

### Page 1 — Homepage (`/`)
- **File:** `src/pages/Home.jsx`, `src/components/Hero.jsx`, `src/components/FeaturedStory.jsx`, `src/components/StoriesGrid.jsx`
- **Features:**
  - Preserved iconic Hero section with mist pulse animation, subtitle, and smooth scroll CTA.
  - Global Header with updated navigation links (*Stories*, *Horror*, *Folklore*, *Fantasy*, *Regions*, *Archive*), real-time Search overlay trigger, and User Account menu.
  - Dynamic Featured Story (*Tonight's Tale*) retrieved directly from published records.
  - Story Discovery Grid with multi-category tabs (*Latest Tales*, *Folklore*, *Horror*, *Bengal*, *Varanasi*, *Psychological*).
  - Enhanced story cards with category gradients, region tags, direct bookmark buttons, and author profile links.

### Page 2 — Login / Authentication (`/login`)
- **File:** `src/pages/Login.jsx`
- **Identity:** *"Enter the Archive"*
- **Features:**
  - Email and password login with validation and password visibility toggle.
  - Reader and Writer registration forms (with author specialty and bio fields).
  - Role-based redirect routing (Readers → `/account`, Writers → `/writer`, Admins → `/admin`), respecting return destinations (`redirect` parameter).
  - One-click **Quick Persona Switcher** for instant testing as Reader, Writer (Aarav Sharma), or Admin (Sanctum Keeper).
  - Password reset modal with feedback.

### Page 3 — Reader Account / My Reading List (`/account`)
- **File:** `src/pages/ReaderAccount.jsx`
- **Identity:** *"Reader Account — Manage your archive of saved stories"*
- **Features:**
  - **Section A (Bookmarks):** Dual tabs for **To Read** and **Favorites** with direct story reading links, card removal, and empty state prompts.
  - **Section B (Reading History):** Chronological log of read stories, relative timestamps (*e.g., 3 days ago*), and live progress bars with "Continue Reading" shortcuts.
  - **Section C (Account Settings):** Pen name editing, secret pigeon email display, local device persistence toggle, and session logout.

### Page 4 — Browse Tales / Story Archive (`/archive`)
- **File:** `src/pages/BrowseArchive.jsx`
- **Identity:** *"Browse Tales / Regional Archive"*
- **Features:**
  - Dynamic contextual headings (*e.g., "Horror from Bengal"*, *"Folklore from Varanasi"*).
  - Multi-dimensional filter sidebar: Genre (*Folklore, Horror, Fantasy, Psychological, Urban, Historical*), Region (*Bengal, Delta Bengal, Varanasi, Malabar, Rajasthan*), Mood (*Chilling, Supernatural, Haunted, Dread*).
  - Real-time search across titles, synopses, authors, and tags.
  - Sorting: *Newest Additions, Oldest Chronicles, Most Feared / Popular, Reading Duration*.
  - URL parameter synchronization (`/archive?region=Bengal&genre=folklore`) for shareable filtered views and browser history navigation.

### Page 5 — Author Profile (`/author/:id`)
- **File:** `src/pages/AuthorProfile.jsx`
- **Features:**
  - Public writer dossier loaded by author ID or slug (*e.g., Aarav Sharma, Utshob Bose*).
  - Framed vintage portrait, specialty tag, and detailed biography.
  - Genuine calculated statistics: Total Published Stories and Total Reader Reactions computed from stored records.
  - Verified social links (Twitter, Instagram).
  - Bibliography grid listing all published works by the author with excerpt and thumbnail.

### Page 6 — Writer Dashboard (`/writer`)
- **File:** `src/pages/WriterDashboard.jsx`
- **Features:**
  - Restricted to authenticated Writers and Admins.
  - 3-pane layout: Sidebar navigation (*My Stories*, *Analytics*, *Settings*), middle **Manuscript Registry table**, and right **Draft Preview pane**.
  - Manuscript Workshop (Editor modal) with fields for Title, Slug, Genre, Region, Mood, Synopsis, HTML/Prose Body, Cover Image, Content Warnings, and Tags.
  - Full lifecycle progression: `Draft` → `Submitted` (Pending Review) → `Published` (or `Revision Requested`).
  - Real Writer Analytics: Total published works, total views, reader reactions, and bookmark counts.

### Page 7 — Admin Dashboard — Sanctum Sanctorum (`/admin`)
- **File:** `src/pages/AdminDashboard.jsx`
- **Identity:** *"Sanctum Sanctorum — Administrative Dashboard"*
- **Features:**
  - Restricted to authenticated Administrators.
  - Key Metrics cards: *Total Archives*, *Active Scribes*, and *Pending Review*.
  - Live System Status health indicator showing latency, storage quota, and connection status.
  - **Urgent Moderation Altar:** Inspect submitted manuscripts, review author info, read full story body, and execute **Approve & Publish**, **Request Revision** (with note), or **Reject**.
  - **Archive Ledger:** Searchable and filterable master catalogue of all manuscripts.
  - **CSV Export:** One-click "EXPORT LEDGER" button generating and downloading a clean CSV file.

### Additional Pages & Components
- **Article Reader (`/article/:id`):** `src/pages/Article.jsx` — Scroll progress tracking, bookmark toggle, live reaction counter, and author links.
- **Search Modal:** `src/components/SearchModal.jsx` — Gothic search overlay accessible from anywhere via the global header.
- **Submission Guidelines (`/submission-guidelines`):** `src/pages/SubmissionGuidelines.jsx` — Information for prospective scribes.
- **About Page (`/about`):** `src/pages/About.jsx` — Author portfolio and vision statement.

---

## 5. Pre-configured Personas (Demo Accounts)

| Role | Pen Name | Email Address | Password | Permissions & Destination |
|---|---|---|---|---|
| **Reader** | Wandering Scholar | `reader@hollowink.com` | `reader123` | Bookmarks, Reading History (`/account`) |
| **Writer** | Aarav Sharma | `aarav@hollowink.com` | `writer123` | Story Editor, Manuscript Workshop (`/writer`, `/author/usr_writer_aarav`) |
| **Writer** | Utshob Bose | `utshob@hollowink.com` | `writer123` | Sundarbans folklore manuscript management (`/writer`, `/author/usr_writer_utshob`) |
| **Administrator** | Sanctum Keeper | `admin@hollowink.com` | `admin123` | Sanctum Sanctorum, Moderation Queue, Archive Ledger, CSV Export (`/admin`) |

*Tip: You can switch personas instantly using the **Quick Persona Switcher** on the `/login` page or inside the navbar profile dropdown.*

---

## 6. Database & Supabase Integration Files

The project is fully pre-configured for Supabase PostgreSQL integration:

1. **`horror-blog-react/src/services/supabase.js`**: Dual-mode client initialized with `@supabase/supabase-js`.
2. **`horror-blog-react/.env.example`**: Template for `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`.
3. **`supabase_schema.sql`**: Complete PostgreSQL schema containing table definitions (`profiles`, `stories`, `bookmarks`, `reading_history`, `moderation_logs`), Row-Level Security policies, and seed folklore stories.

---

## 7. Horror & Gothic Folklore Thumbnail Overhaul

All story cover images have been audited and replaced with verified, authentic horror and South Asian gothic folklore photography:
- **Removed Irrelevant Placeholders:** Completely eliminated the white PlayStation 5 controller, daytime sunny mountain landscapes, and pink sunset sky stock photos.
- **Verified URLs:** Every image URL is tested and validated for high resolution and fast response.
- **Atmospheric Alignment:**
  - *The Weaver of Silent Threads:* Moonlit ancient ruined pillars and midnight mist (`photo-1518709268805-4e9042af9f23`).
  - *The Whispers in the Banyan:* Ancient gnarled banyan roots and dense dark fog (`photo-1601873968252-6862fba1ff87`).
  - *The Last Tide of Sundarban:* Submerged dark mangrove silhouettes in black delta waters (`photo-1589556183130-530470785fab`).
  - *The Midnight Rickshaw:* Desolate wet Kolkata alleyway at midnight (`photo-1648964562779-36b7231fa44e`).
  - *Beyond the Tharavadu:* Dark carved nalukettu wooden entrance & ancestral archway (`photo-1576308598676-59f4664583b8`).
  - *The Parsi Watchmaker:* Moody antique pocket watch on deep black backdrop (`photo-1562537218-26057ef20502`).
  - *Tide Country Spirits:* Pitch dark eerie lake with black water reflections (`photo-1478760329108-5c3ed9d495a0`).
  - *The Jatra Dancer's Anklet:* Eerie ritual fire burning in night shadows (`photo-1574336310290-8f545d91cd5f`).
  - *Rituals of the Forgotten Ghat:* Sunken ancient stone steps and ruined archways (`photo-1785140387910-06107bd56eb9`).
  - *The Shadow of the Haveli:* Atmospheric Rajasthani haveli facade in deep desert shadows (`photo-1682414181885-a22c7a922cd7`).
- **Zero-Friction LocalStorage Migration:** `src/services/storage.js` bumps the storage key to `hollowink_stories_v2` and automatically migrates any cached user data on reload, replacing old controller/mountain photos immediately.
- **Fail-safe `onError` Handling:** `<img />` tags in `StoryCard`, `FeaturedStory`, `AuthorProfile`, and `Article` now incorporate fail-safe fallbacks so broken image icons never appear.

---

## 8. Build Verification

- **Production Build:** Verified with `npm run build`
- **Output:** Clean production bundle with **0 errors and 0 ESLint warnings**.

