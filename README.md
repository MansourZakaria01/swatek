# SWATEK Platform

Smart Waves Technologies — full-stack web platform for Industry 4.0, AI, IoT, clean energy, smart agriculture, and circular economy solutions.

## Stack

- **Frontend & API**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Animation**: Framer Motion + GSAP ScrollTrigger
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT with role-based access control (admin / editor / viewer)
- **Validation**: Zod (client + server)
- **Containerization**: Docker + Docker Compose

---

## Quick Start (Local Dev)

### 1. Prerequisites
- Node.js 20+
- Docker Desktop (for PostgreSQL)

### 2. Install dependencies
```bash
npm install
```

### 3. Start PostgreSQL
```bash
docker-compose up postgres -d
```

### 4. Configure environment
```bash
cp .env.example .env
# .env is pre-configured for the local Docker DB — no changes needed for dev
```

### 5. Run migrations + seed
```bash
npx prisma migrate dev --name init
npm run db:seed
```

### 6. Start dev server
```bash
npm run dev
```

App runs at **http://localhost:3000**
Admin panel at **http://localhost:3000/admin/login**

Default credentials:
- admin@swatek.tech / Admin@123
- editor@swatek.tech / Editor@123

---

## Docker (Full Stack)
```bash
docker-compose up --build
```

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/login | Public | Get JWT token |
| GET | /api/auth/me | Bearer | Current user |
| GET | /api/technologies | Public | List technologies (filter: domain, tag, featured) |
| POST | /api/technologies | editor+ | Create technology |
| GET | /api/technologies/[id] | Public | Get by id or slug |
| PATCH | /api/technologies/[id] | editor+ | Update |
| DELETE | /api/technologies/[id] | admin | Delete |
| GET | /api/domains | Public | List domains with tech count |
| GET | /api/solutions | Public | List solutions |
| POST | /api/solutions | editor+ | Create solution |
| GET | /api/solutions/[id] | Public | Get solution |
| GET | /api/case-studies | Public | List (filter: sector, geography, tag) |
| POST | /api/case-studies | editor+ | Create |
| GET | /api/knowledge | Public | Document library (filter: category, language, tag) |
| POST | /api/knowledge | editor+ | Add document |
| GET | /api/partners | Public | List partners |
| POST | /api/partners | editor+ | Create partner |
| GET | /api/metrics | Public | Global impact metrics |
| POST | /api/inquiries | Public | Submit inquiry (contact form) |
| GET | /api/inquiries | auth | List inquiries (admin/editor) |
| GET | /api/inquiries/[id] | auth | Get inquiry detail |
| PATCH | /api/inquiries/[id] | editor+ | Update status / assignment |
| POST | /api/inquiries/[id]/notes | auth | Add internal note |
| GET | /api/admin/analytics | auth | Dashboard stats |
| GET | /api/admin/users | admin | List users |
| POST | /api/admin/users | admin | Create user |
| POST | /api/upload | editor+ | Upload document file |

---

## Project Structure

```
swatek-platform/
├── app/
│   ├── api/               # Route Handlers (REST API)
│   ├── admin/             # Admin dashboard
│   ├── technologies/      # Public tech catalog
│   ├── solutions/         # Solutions pages
│   ├── case-studies/      # Case studies
│   ├── knowledge/         # Document library
│   ├── partners/          # Partners
│   ├── contact/           # Contact + inquiry form
│   └── page.tsx           # Homepage (cinematic)
├── components/
│   ├── cinematic/         # Reveal, AnimatedCounter, ExpandableCard, HeroSection
│   ├── shared/            # Navbar, Footer
│   ├── ui/                # Base UI components
│   └── admin/             # Admin-specific components
├── lib/
│   ├── prisma.ts          # Prisma client singleton
│   ├── auth.ts            # JWT utilities
│   ├── utils.ts           # cn() helper
│   └── validation/        # Zod schemas
├── prisma/
│   ├── schema.prisma      # Full DB schema
│   └── seed.ts            # Realistic seed data
├── public/uploads/        # File uploads (swap to S3 in production)
├── .env.example
├── docker-compose.yml
└── Dockerfile
```

## Roles

| Role | Permissions |
|------|------------|
| admin | Full access — CRUD everything, manage users, delete records |
| editor | Create/edit content and manage inquiries — no user management |
| viewer | Read-only access to inquiries assigned to them |
