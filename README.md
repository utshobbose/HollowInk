# Hollow Ink — Full-Stack Dark Literature & South Asian Gothic Platform

A comprehensive digital storytelling, folklore, and horror literature platform built with React, React Router v6, Tailwind CSS, and a persistent local client-side relational storage engine.

The platform faithfully preserves the signature Hollow Ink visual atmosphere (abyssal black canvas, golden hairline dividers, blood-red accents, and delicate serif typography) while providing complete multi-role workflows for Visitors, Readers, Authors/Writers, and Platform Administrators.

---

## 🎭 User Personas & Demo Credentials

Pre-configured accounts with seeded folklore manuscripts and archival histories:

| Role | Pen Name | Email Address | Password | Clearances |
|---|---|---|---|---|
| **Reader** | Wandering Scholar | `reader@hollowink.com` | `reader123` | Bookmarks, Reading History, Account Settings |
| **Writer / Author** | Aarav Sharma | `aarav@hollowink.com` | `writer123` | Manuscripts Workshop, Story Editor, Submission, Analytics |
| **Writer / Author** | Utshob Bose | `utshob@hollowink.com` | `writer123` | Manuscripts, Sundarbans & Bengal Gothic Archive |
| **Administrator** | Sanctum Keeper | `admin@hollowink.com` | `admin123` | Sanctum Sanctorum, Moderation Altar, Ledger, CSV Export |

*Note: You can switch personas instantly using the **Quick Persona Switcher** on the `/login` page or inside the navbar profile dropdown!*

---

## 📜 Complete Page Implementations

### Page 1 — Homepage (`/`)
- **Global Header**: Preserves established Hollow Ink logo with blood-red `INK`. Includes links for *Stories*, *Horror*, *Folklore*, *Fantasy*, *Regions*, and *Archive*, along with an archival Search modal trigger and Account entry/avatar dropdown.
- **Hero Section**: Preserves signature ambient mist animation (`mistPulse`), glowing title typography, and smooth scroll button.
- **Tonight's Featured Tale**: Dynamic retrieval from published stories featuring *The Weaver of Silent Threads* (or latest curated manuscript), with word count, reading duration, excerpt, and author attribution.
- **The Living Vault (Story Collection)**: Multi-category tabs (*Latest Tales, Folklore, Horror, Bengal, Varanasi, Psychological*), animated reveal cards with genre gradient badges, direct bookmark toggles, and author profile links.
- **Newsletter & Footer**: Email dispatch signup and canonical navigation links.

### Page 2 — Login / Authentication (`/login`)
- **Atmospheric "Enter the Archive" Interface**: Dark misty backdrop, password visibility toggle, and instant persona quick-switchers.
- **Dual Flow**: Sign In and Reader/Writer Registration (with author specialty and bio fields).
- **Password Reset**: Self-service secret password reset dialog.
- **Role-Based Routing**: Redirects Readers to `/account`, Writers to `/writer`, and Admins to `/admin` (respecting return destinations).

### Page 3 — Reader Account / My Reading List (`/account`)
- **Section A — Bookmarks**: Dual-tab toggle between **To Read** and **Favorites**. Direct tale launcher, deletion controls, and empty states.
- **Section B — Reading History**: Automatically tracks opened stories, logs last read timestamps (e.g. *3 days ago*), and displays real reading progress percentage bars with "Continue Reading" shortcuts.
- **Section C — Account Settings**: Edit Pen Name / Display Name, update Secret Pigeon email, toggle local device persistence, and sign out.

### Page 4 — Browse Tales / Story Archive (`/archive`)
- **Regional & Categorical Archives**: Dynamic thematic headings (e.g. *"Horror from Bengal"*, *"Folklore from Varanasi"*).
- **Multi-Dimensional Filters**: Genre (*Folklore, Horror, Fantasy, Psychological, Urban, Historical*), Region (*Bengal, Delta Bengal, Varanasi, Malabar, Rajasthan*), and Atmosphere Mood (*Chilling, Supernatural, Haunted, Dread*).
- **Keyword Search & Sorting**: Search by title, synopsis, author, or tags. Sort by *Newest, Oldest, Most Feared / Popular, or Reading Duration*.
- **URL Parameter Sync**: Shareable filtered URLs (e.g. `/archive?region=Bengal&genre=folklore`) supporting browser back/forward navigation.

### Page 5 — Author Profile (`/author/:id`)
- **Public Writer Dossier**: Framed vintage portrait, author specialty badge, biography, and verified social media links.
- **Authentic Metrics**: Total published stories count and cumulative reader reactions calculated dynamically from real stored records.
- **Bibliography Grid**: Complete collection of published works with excerpts, cover art, and reading links.

### Page 6 — Writer Dashboard (`/writer`)
- **3-Pane Workspace**: Left navigation sidebar, center Manuscripts table, and right-hand **Draft Preview Pane**.
- **Manuscript Workshop (Editor)**: Full drafting interface with fields for Title, Slug (auto-generated), Category, Region, Mood, Synopsis, HTML/Prose Body, Cover Image, Content Warnings, and Tags.
- **Lifecycle Progression**: `Draft` → `Submitted` (Pending Review) → `Published` (or `Revision Requested`).
- **Real Writer Analytics**: Real counts for published stories, story views, reader reactions, and bookmark saves.

### Page 7 — Admin Dashboard — Sanctum Sanctorum (`/admin`)
- **Key Metrics**: Real-time calculated counters for *Total Archives*, *Active Scribes*, and *Pending Review*.
- **Urgent Moderation Altar**: Inspect pending submissions, read full manuscript text, inspect author metadata, and execute **Approve & Publish**, **Request Revision** (with note), or **Reject**.
- **Archive Ledger & CSV Export**: Master searchable table of all manuscripts across all states. One-click **EXPORT LEDGER** downloads a clean CSV file.
- **System Health Diagnostics**: Live health check of storage quota allocated, latency, and index count.

---

## 🛠️ Technology Stack

- **Frontend**: React 18.2.0, React Router DOM v6.20.0
- **Styling**: Tailwind CSS 3.3.0 with PostCSS, SVG fractalNoise grain overlay, and custom animations (`fadeDown`, `mistPulse`, `arrowPulse`, `pageIn`)
- **Typography**: Google Fonts (`Cinzel Decorative`, `Cinzel`, `Cormorant Garamond`)
- **Persistence**: Relational Client-Side Storage Service (`localStorage`) with reactive custom events across tabs, pre-seeded with rich South Asian folklore tales

---

## 🚀 Quick Start Instructions

1. Navigate to the project directory:
   ```bash
   cd horror-blog-react
   ```

2. Start the local development server:
   ```bash
   npm start
   ```

3. Open your browser at [http://localhost:3000](http://localhost:3000)

4. To build for production deployment:
   ```bash
   npm run build
   ```
