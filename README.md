# Flora Group — Public Website

> Personal portfolio project. Not affiliated with or endorsed by Flora Group; the brand name and imagery are used only to make the demo realistic.

The public, bilingual (English / Arabic) website for Flora Group, built with **Next.js 16**, **React 19**, **Tailwind CSS 4** and **framer-motion**. Part 2 of a 3-part CMS ecosystem: the look and content come from a .NET API and are edited from a separate admin portal, so changes go live **without a rebuild**.

<!-- screenshot: docs/screenshots/home.png -->
![Home page](docs/screenshots/home.png)

## The ecosystem

```
 Admin Portal (Next.js, :3001) --JWT cookie (BFF)--> .NET API (:5253) <--> SQL Server
        |                                                 ^
        | POST /api/revalidate                            | GET /api/ui/config, /api/jobs
        v                                                 |
 Public Site (this repo, :3000) --------------------------+
```

| Repo | Role |
| --- | --- |
| [flora-backend](https://github.com/Jawabreh2k/flora-backend) | .NET 9 Clean Architecture API + SQL Server |
| **flora-group-website** | Public site (this repo) |
| [flora-admin-portal](https://github.com/Jawabreh2k/flora-admin-portal) | Admin portal for theme, jobs, companies, inquiries, subscribers |

## What's interesting

- **CMS-driven theming.** Colours, radius, fonts, homepage sections and dark mode come from `GET /api/ui/config` and are mapped to CSS variables. Edit them in the portal and the site updates within seconds.
- **Instant publish.** The portal calls this site's `POST /api/revalidate` webhook (shared secret) after each save, so Next.js caches are invalidated immediately.
- **Graceful degradation.** The careers API tries the CMS first (5s timeout) and falls back to bundled seed data if the backend is down. See [docs/JOBS_FALLBACK.md](docs/JOBS_FALLBACK.md).
- **Bilingual jobs.** Job posts show their Arabic translation when one exists and fall back to English.
- **Forms with real backends.** Contact form and newsletter subscription post to the API, with a honeypot and rate limiting.
- **Hardened.** Content-Security-Policy headers, `robots`/`sitemap`, dynamic OpenGraph image.

## Run locally

**Prerequisites:** Node.js 20+ and the [.NET API](https://github.com/Jawabreh2k/flora-backend) running on `http://localhost:5253` (see its README).

```bash
cp .env.example .env.local     # copy .env.example .env.local on Windows
npm install
npm run dev                    # http://localhost:3000
```

In `.env.local`, set `FLORA_REVALIDATE_SECRET` to any random string. The **admin portal must use the same value**, otherwise publishing still works but takes up to `FLORA_CONFIG_REVALIDATE` seconds (default 60) to appear instead of being instant.

If the API is down, the site still loads: theme and jobs fall back to bundled defaults.

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm test` | Vitest unit tests |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

## Structure

```
app/          # App Router pages: home, careers, contact, subsidiaries, API routes
components/   # UI components
lib/          # API clients (ui-config, jobs), i18n, env validation, rate limiting
data/         # Seed data used as the jobs fallback
docs/         # Design notes
```
