# Setup Guide

## Prerequisites

- **Node.js** 18 or higher
- **npm** 9 or higher

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd iron-log

# Install dependencies
npm install
```

## Development

```bash
npm run dev
```

Opens the dev server at [http://localhost:5173](http://localhost:5173) with hot module replacement.

## Available Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `vite` | Start development server |
| `npm run build` | `tsc -b && vite build` | Type-check and build for production |
| `npm run preview` | `vite preview` | Preview production build |
| `npm run lint` | `eslint .` | Run ESLint checks |
| `npm test` | `vitest run` | Run unit tests once |
| `npm run test:watch` | `vitest` | Run tests in watch mode |

## Production Build

```bash
npm run build
```

Output goes to `dist/`. Serve with any static file server or deploy to Vercel/Netlify.
