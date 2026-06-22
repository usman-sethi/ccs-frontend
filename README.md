# CCS — Core Computing Society

Next.js 15 App Router conversion of the CCS website.

## Stack

- **Framework**: Next.js 15 (App Router, JavaScript/JSX)
- **Styling**: Tailwind CSS v4
- **UI**: shadcn/ui components (converted to JSX)
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Auth**: Express/Node backend (JWT via cookies)
- **Storage**: localStorage (site content, theme)

## Getting started

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your backend URL
npm run dev
```

## Project structure

```
src/
  app/             → Next.js App Router pages (thin server wrappers)
  features/        → Client page components (one per route)
  components/
    shared/        → Navbar, Footer, Cards, etc.
    ui/            → shadcn/ui components (JSX)
  context/         → ThemeContext, SiteContentContext, AuthContext
  hooks/           → use-auth, use-mobile
  lib/             → utils, site-content, api, image-crop
  constants/       → society data
```

## Connecting the Express backend

All API calls live in `src/lib/api.js`. Each function has a JSDoc comment
showing the expected endpoint, request body, and response shape.

Set `NEXT_PUBLIC_API_URL` in `.env.local` to point to your running backend.

## Offline / site content

All public content (society info, clubs, events, etc.) is stored in `localStorage`
under the key `ccs-site-content-v1`. Admins can customize it via `/admin`.
The app works fully offline for all read-only pages.

## Auth flow

1. User signs in via `/auth` → `POST /api/auth/signin`
2. Backend returns `{ id, email, displayName, avatarUrl, isAdmin, token }`
3. User is stored in `localStorage` under `ccs-auth-user`
4. Protected routes (`/dashboard`, `/admin`) check auth client-side
