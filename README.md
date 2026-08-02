# Portfolio

Personal portfolio of **Thu Rein Htet** — a terminal-inspired website showcasing my projects, work experience, blog posts, and adventures beyond coding.

## Features

- 💼 Showcase featured projects
- 📝 Publish blog posts with MDX
- 📖 Display work experience timeline
- 🚀 Highlight skills and adventures beyond coding
- 📄 Download resume
- 📬 Contact form with email support
- 🔒 Admin dashboard for content management
- 🌙 Dark / Light mode
- 📱 Fully responsive design

**Live Demo:** https://thureinhtet-portfolio.vercel.app

## Built With

| Category       | Technology                                      |
| -------------- | ----------------------------------------------- |
| Framework      | Next.js 16 (App Router)                         |
| Language       | TypeScript                                      |
| UI             | React 19, shadcn/ui (Radix UI)                  |
| Styling        | Tailwind CSS v4                                 |
| Database       | Drizzle ORM, SQLite (local), Turso (production) |
| Authentication | Better Auth                                     |
| Animation      | Framer Motion, React View Transitions           |
| Storage        | Cloudinary                                      |
| Email          | Nodemailer                                      |
| Automation     | Makefile                                        |

## Project Structure

```text
app/          Routes and API handlers
features/     Feature-based modules
components/   Shared UI components
hooks/        Custom React hooks
lib/          Utilities and shared helpers
db/           Drizzle schema and migrations
public/       Static assets
docs/         Project documentation
```

For a detailed overview, see [**PROJECT_MAP.md**](./docs/PROJECT_MAP.md) .

## Documentation

This repository includes documentation for developers and AI coding agents.

| Document                                            | Description                                                              |
| --------------------------------------------------- | ------------------------------------------------------------------------ |
| [AGENTS.md](./AGENTS.md)                            | Root instruction file for AI coding agents                               |
| [CODING_GUIDELINES.md](./docs/CODING_GUIDELINES.md) | Coding standards, conventions, and best practices                        |
| [DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md)         | Design principles, UI components, design tokens, and styling conventions |
| [PROJECT_MAP.md](./docs/PROJECT_MAP.md)             | Overview of features, directories, and key entry points                  |

## Getting Started

### Prerequisites

- Node.js 22+
- npm
- Git

### Clone the repository

```bash
git clone https://github.com/thureinhtet99/portfolio.git
cd portfolio
```

### Install dependencies

```bash
npm install --legacy-peer-deps
```

### Configure environment variables

```bash
cp .env.example .env.local
```

Fill in the required environment variables.

### Prepare the database

```bash
npm run db:generate
npm run db:migrate
```

### Start the development server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

## Available Scripts

| Command            | Description                  |
| ------------------ | ---------------------------- |
| `make dev`         | Start the development server |
| `make build`       | Create a production build    |
| `make lint`        | Run ESLint                   |
| `make typecheck`   | Run TypeScript type checking |
| `make db:generate` | Generate Drizzle migrations  |
| `make db:migrate`  | Apply database migrations    |
| `make db:studio`   | Open Drizzle Studio          |

## Roadmap

### Planned Features

- [ ] Labs page showcasing skills and adventures
- [ ] AI chat assistant
- [ ] Portfolio analytics
- [ ] Internationalization (i18n)

## Acknowledgements

Special thanks to the following people and projects for inspiration:

- [Jason Cameron](https://jasoncameron.dev) — Terminal-inspired design
- [theodorusclarence](https://theodorusclarence.com) — Portfolio layout and feature inspiration
- [Chánh Đại](https://chanhdai.com) — Timeline and work experience components
- [Better Auth](https://better-auth.com) — Authentication library

## License

Distributed under the MIT License.

See [`LICENSE`](./LICENSE) for more information.
