# HomePro Connect (Complete My Project)

Marketing site for Complete My Project — connecting UK homeowners with vetted multi-trade companies for full renovation projects.

## Stack

- Vite
- React + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (auth, database, edge functions)

## Local development

```sh
npm install
npm run dev
```

The dev server runs at `http://localhost:8080`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

## Environment

Copy `.env` and set your Supabase URL and anon key (see `src/integrations/supabase/client.ts`).
