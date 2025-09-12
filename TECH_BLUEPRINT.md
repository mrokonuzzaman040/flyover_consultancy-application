Flyover Consultancy — Technical Blueprint

Scope

- Next.js 15 App Router, TypeScript, Tailwind v4
- No external CMS; custom admin (phase 2)
- PostgreSQL via Prisma ORM
- Email via Resend/Nodemailer (phase 2)

Folder Structure

- `app/` — routes (RSC) and route handlers
- `components/` — UI and forms (client components as needed)
- `lib/` — shared utilities (db client, validators)
- `prisma/` — Prisma schema and migrations
- `public/` — static assets (logo, images)

Core Routes

- `/` — Home hero + CTA + social proof
- `/services` and subpages: `admission-support`, `visa-services`, `accommodation`, `health-insurance`, `migration`
- `/destinations` and `/destinations/[slug]` — country pages
- `/courses` — study areas
- `/scholarships`
- `/resources` and `/resources/[slug]` — blog/resources
- `/events` and `/events/[slug]`
- `/testimonials`
- `/about`
- `/contact`
- `/book-consultation`
- `/legal/privacy`, `/legal/terms`
- `/api/leads` — lead intake
- `/api/health` — healthcheck
- `app/robots.ts`, `app/sitemap.ts` — SEO

Component Map (selected)

- `components/site-header.tsx` — top nav + sticky CTA
- `components/site-footer.tsx` — footer links + contacts
- `components/lead-form.tsx` — reusable lead form
- `components/cta-button.tsx` — primary CTA button

Data Model (Prisma)

- `Lead` — name, email, phone?, countryInterest[], serviceInterest[], message?, utm_*, source, status, createdAt
- `Event` — title, slug, startAt, endAt?, venue?, city?, description, bannerUrl?, status, capacity, seatsRemaining
- `EventRegistration` — eventId, attendeeName, email, phone?, createdAt
- `Post` — title, slug, excerpt?, contentMD, tags[], country[], author, coverUrl?, publishedAt?, status
- `Destination` — country, slug, hero?, overviewMD?, costsMD?, intakesMD?, visaMD?, scholarshipsMD?, popularCourses[], faqs (JSON)
- `Service` — name, slug, sectionsMD[], ctaLabel?
- `Testimonial` — author, quote, source?, avatarUrl?, publishedAt?
- `Office` — city, address, phone, email?, mapEmbedUrl?
- `User` — email, name?, passwordHash?, role (ADMIN/EDITOR)

DB Schema (SQL, conceptual)

The following is a conceptual SQL mapping (PostgreSQL). Prisma will generate equivalent DDL during `migrate`:

```
CREATE TABLE "Lead" (
  id text PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  countryInterest text[] NOT NULL,
  serviceInterest text[] NOT NULL DEFAULT '{}',
  message text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  source text,
  status text NOT NULL DEFAULT 'new',
  createdAt timestamptz NOT NULL DEFAULT now()
);
```

Similar tables exist for Events, Posts, Destinations, etc. See `prisma/schema.prisma:1`.

Admin (Phase 2)

- Route: `/admin` protected via NextAuth (email/password; 2FA optional)
- CRUD pages for all models using server actions + Prisma
- Image upload to S3/R2 via signed URLs
- RBAC: `User.role` (ADMIN/EDITOR)
- Draft/Publish flags on content models

Forms & Notifications

- Validation with Zod (client + server)
- Spam protection: reCAPTCHA v3 or hCaptcha on `LeadForm`
- Email notifications via Resend; user autoresponder
- Optional webhook to CRM (HubSpot/Pipedrive)

SEO & Analytics

- Per-route metadata in RSC files
- `app/robots.ts`, `app/sitemap.ts`
- JSON-LD via script tags (Organization, LocalBusiness, Article, Event)
- GA4 + Meta Pixel integrated via layout or tag manager (consent-aware)

Performance & Accessibility

- Image optimization via `next/image` where needed
- Lazy-load embeds; route prefetching
- ARIA labels and keyboard focus states in components

Environment & Deployment

- Vercel recommended; set env vars from `.env.example:1`
- After setting `DATABASE_URL` run: `npx prisma migrate dev`
- Health route: `/api/health`

