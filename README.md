# CCS — Core Computing Society

A modern web platform for the Core Computing Society built with Next.js 15 (App Router). The application delivers a fast, responsive, and accessible experience while providing administrators with an intuitive content management interface.

---

## Features

- Modern responsive interface
- Server-side rendering with Next.js App Router
- Secure authentication
- Admin dashboard for content management
- Accessible UI built with Tailwind CSS and shadcn/ui
- Form validation using React Hook Form and Zod
- Smooth animations with Framer Motion
- Progressive offline support

---

## Tech Stack

| Layer | Technology |
|--------|------------|
| Framework | Next.js 15 |
| Language | JavaScript (ES2023) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Forms | React Hook Form + Zod |
| Animation | Framer Motion |
| Backend | Node.js / Express |
| Authentication | JWT |
| Database | MongoDB |

---

## Requirements

- Node.js 18+
- npm 9+

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd ccs
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env.local
```

Configure the required environment variables.

Start the development server:

```bash
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

---

## Environment Variables

Create a `.env.local` file.

| Variable | Description |
|----------|-------------|
| NEXT_PUBLIC_API_URL | Backend API URL |

Refer to `.env.example` for the complete configuration.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| npm run dev | Start development server |
| npm run build | Build for production |
| npm run start | Start production server |
| npm run lint | Run ESLint |

---

## Project Structure

```
src/
├── app/
├── components/
├── context/
├── features/
├── hooks/
├── lib/
├── constants/
└── styles/
```

---

## Backend Integration

The frontend communicates with a separate backend service through REST APIs.

Ensure the backend is running and configure the API endpoint in your environment variables before starting the application.

---

## Security

This project follows common web security best practices including:

- Secure authentication
- Protected API routes
- Input validation
- Environment-based configuration
- Secure cookie handling (when supported by the backend)
- Production-ready build optimization

For security reasons, implementation details are intentionally omitted from this documentation.

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

## License

This project is licensed under the applicable license specified by the repository owner.
