# Cinematism

Cinematism is a movie discovery app built with React, Vite, Tailwind CSS, and the TMDB API. It includes browsing for movies, TV shows, anime, search, title details, and a contact QR modal in the navbar.

## Tech Stack

- React 19
- Vite 8
- React Router
- Tailwind CSS 4
- Axios
- Lucide React

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file:

```bash
cp .env.example .env
```

3. Add your TMDB API key to `.env`:

```env
VITE_TMDB_KEY=your_tmdb_api_key_here
```

4. Start the app:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` starts the development server
- `npm run build` creates a production build
- `npm run preview` previews the production build locally
- `npm run lint` runs ESLint

## GitHub Push Checklist

- Keep `.env` out of source control
- Commit `.env.example` so deployment environments know which variables are required
- Make sure `npm run lint` and `npm run build` pass before pushing

## Vercel Deployment

This project includes `vercel.json` with a rewrite rule so React Router routes like `/movies`, `/anime`, `/search`, and `/detail/:type/:id` work correctly on refresh.

### Deploy Steps

1. Push the project to a GitHub repository.
2. Import the repository into Vercel.
3. In Vercel project settings, add this environment variable:

```env
VITE_TMDB_KEY=your_tmdb_api_key_here
```

4. Use the default Vercel settings for a Vite app:

- Build Command: `npm run build`
- Output Directory: `dist`

5. Deploy.

## Notes

- TMDB API keys exposed in frontend apps are still visible in the browser, so use a key intended for client-side usage.
- This product uses the TMDB API but is not endorsed or certified by TMDB.
