# CCS — Core Computing Society

A Next.js 15 (App Router) rebuild of the Core Computing Society website — fast, offline-capable, and built for easy content management by society admins.

## Features

- Server-rendered pages via the Next.js App Router with thin server wrappers
- Fully offline read-only experience — society info, clubs, and events persist in `localStorage`
- Admin-editable site content through a dedicated `/admin` dashboard
- JWT-based authentication against an external Express/Node backend
- Accessible, themeable UI built on shadcn/ui and Tailwind CSS v4
- Form validation via React Hook Form + Zod
- Motion and micro-interactions powered by Framer Motion

## Tech Stack

| Layer         | Technology                              |
|---------------|-------------------------------------------|
| Framework     | Next.js 15 (App Router, JavaScript/JSX)   |
| Styling       | Tailwind CSS v4                           |
| UI Components | shadcn/ui (converted to JSX)              |
| Animation     | Framer Motion                             |
| Forms         | React Hook Form + Zod                     |
| Auth          | Express/Node backend (JWT via cookies)    |
| Storage       | `localStorage` (site content, theme)      |

## Prerequisites

- Node.js 18.17 or later
- npm 9+ (or an equivalent package manager)
- A running instance of the Express backend (see [Connecting the Express Backend](#connecting-the-express-backend))

## Getting Started

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your backend URL
npm run dev
```

The app will be available at `http://localhost:3000`.

## Environment Variables

| Variable              | Description                    | Required |
|------------------------|---------------------------------|----------|
| `NEXT_PUBLIC_API_URL`  | Base URL of the Express backend | Yes      |

## Available Scripts

| Command         | Description                 |
|------------------|-------------------------------|
| `npm run dev`    | Start the development server |
| `npm run build`  | Create a production build    |
| `npm run start`  | Run the production build     |
| `npm run lint`   | Run ESLint checks             |

## Project Structure
