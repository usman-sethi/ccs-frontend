# CCS — Core Computing Society

A Next.js 15 (App Router) rebuild of the Core Computing Society website — fast, offline-capable, and built for easy content management by society admins.

## Features

- Server-rendered pages via the Next.js App Router with thin server wrappers
- Fully offline read-only experience — society info, clubs, and events persist in localStorage
- Admin-editable site content through a dedicated /admin dashboard
- JWT-based authentication against an external Express/Node backend
- Accessible, themeable UI built on shadcn/ui and Tailwind CSS v4
- Form validation via React Hook Form and Zod
- Motion and micro-interactions powered by Framer Motion

## Tech Stack

| Layer         | Technology                              |
|---------------|-------------------------------------------|
| Framework     | Next.js 15 (App Router, JavaScript/JSX)   |
| Styling       | Tailwind CSS v4                           |
| UI Components | shadcn/ui (converted to JSX)              |
| Animation     | Framer Motion                             |
| Forms         | React Hook Form and Zod                   |
| Auth          | Express/Node backend (JWT via cookies)    |
| Storage       | localStorage (site content, theme)        |

## Prerequisites

- Node.js 18.17 or later
- npm 9 or later (or an equivalent package manager)
- A running instance of the Express backend (see Connecting the Express Backend below)

## Getting Started

Run the following commands in order:

npm install
cp .env.example .env.local

Then edit .env.local with your backend URL, and start the dev server:

npm run dev

The app will be available at http://localhost:3000

## Environment Variables

| Variable              | Description                    | Required |
|------------------------|---------------------------------|----------|
| NEXT_PUBLIC_API_URL    | Base URL of the Express backend | Yes      |

## Available Scripts

| Command         | Description                 |
|------------------|-------------------------------|
| npm run dev      | Start the development server |
| npm run build    | Create a production build    |
| npm run start    | Run the production build     |
| npm run lint     | Run ESLint checks             |

## Project Structure

src/
  app/             Next.js App Router pages (thin server wrappers)
  features/        Client page components (one per route)
  components/
    shared/        Navbar, Footer, Cards, etc.
    ui/             shadcn/ui components (JSX)
  context/         ThemeContext, SiteContentContext, AuthContext
  hooks/           use-auth, use-mobile
  lib/             utils, site-content, api, image-crop
  constants/       society data

## Connecting the Express Backend

All API calls live in src/lib/api.js. Each function includes a JSDoc comment describing:

- The expected endpoint
- The request body shape
- The response shape

Set NEXT_PUBLIC_API_URL in .env.local to point to your running backend instance.

## Offline and Site Content

All public content, including society info, clubs, and events, is stored in localStorage under the key ccs-site-content-v1. Admins can customize this content through the /admin panel.

Because content is cached locally, all read-only pages work fully offline once loaded.

## Authentication Flow

1. User signs in via /auth, which calls POST /api/auth/signin
2. The backend responds with an object containing id, email, displayName, avatarUrl, isAdmin, and token
3. The user object is persisted in localStorage under ccs-auth-user
4. Protected routes (/dashboard, /admin) verify authentication client-side

## License

This project is licensed under your chosen license. Update this section to match your repository's actual license.
