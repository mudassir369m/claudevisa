# New Euro Consultants — Website

Next.js 14 · TypeScript · Tailwind · Three.js — production-ready, Railway-portable.
Full admin CMS. Every public-facing section is editable at `/admin/content`.

## Stack
- **Framework**: Next.js 14 App Router (standalone output)
- **3D**: three.js (custom Fibonacci-dot Earth + destination arcs, mini-globe on visa pages, 3D passport, score gauge, particle field)
- **Style**: Tailwind + custom CSS design system (sapphire/gold theme)
- **Data**: JSON content store (`data/content.json`) + JSON leads store (`data/leads.json`)
- **Auth**: Signed-cookie admin session (HMAC + `SESSION_SECRET`)
- **Deploy**: Docker (multi-stage) + `railway.json`

## Local run

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000. Admin at `/admin/login`.

## Env

```
ADMIN_EMAIL=admin@neweuroconsultants.com
ADMIN_PASSWORD=ChangeMe!Strong2026
SESSION_SECRET=change-this-32-char-random-secret
NEXT_PUBLIC_SITE_URL=https://neweuroconsultants.com
DATA_DIR=./data
```

## Public routes

| Route | Description |
|---|---|
| `/` | Home — hero, trust strip, stats, countries, services, process, tours, videos, gallery, testimonials, office w/ pinned map, FAQ, CTA |
| `/visa/[slug]` | Per-country page (uk, usa, canada, australia, schengen, turkey) with mini 3D globe |
| `/tours` | Tour catalog with 3D boarding-pass hero |
| `/eligibility` | 7-step wizard with 3D score gauge |
| `/about` | About the firm |
| `/contact` | Contact form + pinpoint map |

## Admin routes

| Route | Description |
|---|---|
| `/admin/login` | Sign in |
| `/admin` | Dashboard: KPIs + recent leads |
| `/admin/content` | A-Z Content Manager — edit every section |
| `/admin/leads` | Leads inbox with filter, search, CSV export, WhatsApp/call/delete |

## Content Manager (`/admin/content`)

Tabs for every section:

- Announcement Bar — toggle + edit marquee items
- Hero — pre-headline, headline words, subhead, CTAs, trust strip, optional background video/image URL
- Trust Badges — CRUD (icon + title + sub)
- Stats — CRUD counters
- Countries — full CRUD per country incl. visa types, eligibility, docs, per-country FAQs
- Services — CRUD
- Process Steps — CRUD
- Tours — full CRUD (title, days, price, tag, includes, gradient)
- Testimonials — CRUD with rating
- Videos — CRUD YouTube videos with categories (Knowledge / Tours)
- Gallery — CRUD image URLs with categories
- FAQs — CRUD homepage FAQs
- Contact — phone, WhatsApp, address, hours, map URL + embed, coordinates, social links, required docs
- Raw JSON — advanced full-object edit as fallback

Every list has add / delete / move-up / move-down. Save writes `data/content.json` atomically and revalidates all public routes — changes appear instantly.

## Media handling

- Videos = YouTube video IDs (paste the ID from any YouTube URL). Inline click-to-play player, thumbnail auto-loaded.
- Gallery images = direct image URLs (Unsplash, Cloudinary, your own CDN, Instagram-hosted URLs).
- Hero background = optional public video URL (mp4/webm) or image URL.

No S3/R2 storage needed. If you want private uploads later, wire an object store and swap the URL fields for upload buttons — schema stays identical.

## Data persistence

- `data/content.json` — all site content
- `data/leads.json` — contact form + eligibility submissions

On Railway: create a persistent volume mounted at `/app/data` and set:

```
DATA_DIR=/app/data
```

## Deploy to Railway

1. Push repo to GitHub.
2. Railway → New project → Deploy from repo.
3. Add env vars from `.env.example` (strong `SESSION_SECRET`, `ADMIN_PASSWORD`).
4. Add persistent volume mounted at `/app/data` → set `DATA_DIR=/app/data`.
5. Healthcheck already wired to `/api/health`.

## Client

New Euro Consultants Travel & Tours
Office 17-18, 1st Floor, Lord Trade Centre, F-11 Markaz, Islamabad
+92 314 535 2222 · Mon–Fri 9 AM–4 PM
Google Maps pin: https://maps.app.goo.gl/VtsZB1DP8oL6PQm38
