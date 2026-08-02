# Portfolio

My personal portfolio built with **Next.js 16**, **Drizzle ORM**, **SQLite**, and **Better Auth**.

It is designed for:

- **Personal branding**
- **Showcasing life-long events**
- **Sharing knowledge**

**Live Demo:** https://thureinhtet-portfolio.vercel.app

---

## Features

- Browse and search job listings
- Apply for jobs
- Organization management
- Team member invitations and role management
- Organization claim workflow
- Notification system
- Admin dashboard
- User management
- Authentication & Role-Based Access Control (RBAC)

---

## Tech Stack

| Category         | Technology              |
| ---------------- | ----------------------- |
| Framework        | Next.js 16 (App Router) |
| Language         | TypeScript              |
| Database         | PostgreSQL              |
| ORM              | Drizzle ORM             |
| Authentication   | Better Auth             |
| Styling          | Tailwind CSS            |
| UI Components    | shadcn/ui               |
| Rich Text Editor | MDXEditor               |

---

## Project Structure

The project follows a **feature-based architecture**.

```text
app/          Next.js routes
features/     Business logic by feature
components/   Shared UI components
lib/          Shared utilities
services/     External services
drizzle/      Database schema and migrations
docs/         Documentation
```

For a detailed explanation, see:

- [ARCHITECTURE.md](./docs/ARCHITECTURE.md)

---

## Screenshots

> More features are available in the project.

<p align="center">
  <img src="./public/images/home-page.png" alt="Home Page" width="48%" />
  <img src="./public/images/job-listing-detail.png" alt="Job Listing Detail" width="48%" />
</p>

<p align="center">
  <img src="./public/images/application-form.png" alt="Application Form" width="48%" />
  <img src="./public/images/sign-in-page.png" alt="Sign In" width="48%" />
</p>

<p align="center">
  <img src="./public/images/job-listing.png" alt="Employer Dashboard" width="48%" />
  <img src="./public/images/org-setting.png" alt="Organization Settings" width="48%" />
</p>

<p align="center">
  <img src="./public/images/admin-user.png" alt="Admin Users" width="48%" />
  <img src="./public/images/admin-org.png" alt="Admin Organizations" width="48%" />
</p>

---

## Project Documentation

Additional documentation is available in the [`docs`](./docs) directory.

- [Architecture](./docs/ARCHITECTURE.md)
- [Project Diagram (PDF)](./docs/a-lote-lann-kyaung.drawio.pdf)
- [Project Diagram (Draw.io)](./docs/a-lote-lann-kyaung.drawio)

---

# Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/thureinhtet99/portfolio.git
cd portfolio
```

## 2. Install dependencies

```bash
npm install (or) npm install --legacy-peer-deps
```

## 3. Configure environment variables

Copy the example environment file.

```bash
cp .env.example .env.local
```

Required variables:

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_BASE_URL=
NEXT_PUBLIC_APP_URL=
UPLOADTHING_TOKEN=

SEED_ADMIN_EMAIL=
SEED_ADMIN_NAME=
SEED_ADMIN_PASSWORD=
```

Generate a Better Auth secret with either:

```bash
openssl rand -base64 32
```

or from the Better Auth documentation:

https://better-auth.com/docs/installation

---

## 4. Prepare the database

Generate migrations, apply them, and seed the database.

```bash
make db:generate
make db:migrate
```

The seed command creates default users, organizations, and sample job listings for local development.

---

## 5. Start the development server

```bash
make dev
```

Visit:

```
http://localhost:3000
```

---

# Available Scripts

| Command               | Description                                                |
| --------------------- | ---------------------------------------------------------- |
| `make help`           | See available commands                                     |
| `npm run dev`         | Start the development server                               |
| `npm run build`       | Build the application for production                       |
| `npm run lint`        | Run ESLint                                                 |
| `npm run db:generate` | Generate Drizzle migrations                                |
| `npm run db:migrate`  | Apply database migrations                                  |
| `npm run db:seed`     | Seed the database                                          |
| `npm run db:studio`   | Open Drizzle Studio                                        |
| `npm run detect`      | Run Knip to detect unused files, exports, and dependencies |
