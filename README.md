Flyover Consultancy — Study Abroad Website (Next.js 15, App Router)

This repo is a production-ready starter following the provided SRS: public marketing pages, lead capture forms, API endpoints, Prisma schema, and SEO basics. No external CMS; an admin area can be added incrementally.

Quick start

1) Install deps and run dev

```
npm install
npm run dev
```

2) Environment vars

Copy `.env.example` to `.env` and set at least:

- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- `MONGODB_URI=mongodb+srv://user:pass@cluster/db` (required for admin CRUD)
- `DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require` (legacy; not used by admin CRUD)

3) Prisma models

Models for Leads, Events, Posts, Destinations, Services, Testimonials, Offices, Users are in `prisma/schema.prisma:1`. After setting `DATABASE_URL`, run:

```
npx prisma migrate dev --name init
```

4) Routes overview

- Home `app/page.tsx:1`
- Services `app/services/page.tsx:1`
- Destinations index `app/destinations/page.tsx:1`
- Destination details `app/destinations/[slug]/page.tsx:1`
- Courses `app/courses/page.tsx:1`
- Scholarships `app/scholarships/page.tsx:1`
- Resources index `app/resources/page.tsx:1` and article `app/resources/[slug]/page.tsx:1`
- Events index `app/events/page.tsx:1` and detail `app/events/[slug]/page.tsx:1`
- Testimonials `app/testimonials/page.tsx:1`
- About `app/about/page.tsx:1`
- Contact `app/contact/page.tsx:1`
- Book consultation `app/book-consultation/page.tsx:1`
- Legal `app/legal/privacy/page.tsx:1`, `app/legal/terms/page.tsx:1`
- Health check API `app/api/health/route.ts:1`
- Lead API `app/api/leads/route.ts:1`

5) Lead handling

- Client component `components/lead-form.tsx:1` posts to `/api/leads`.
- Server handlers validate with Zod and save to MongoDB via Mongoose when `MONGODB_URI` is set.

6) SEO basics

- Metadata in `app/layout.tsx:1`
- Robots `app/robots.ts:1`, sitemap `app/sitemap.ts:1`

Branding

- Replace `public/logo.png:1` with your brand/white logo.
- Brand color is `bg-brand` (#E30613) from `tailwind.config.ts:1`.

Next steps (suggested)

- Build admin at `/admin` with auth (NextAuth), CRUD for all models.
- Add email notifications (Resend/Nodemailer) from `app/api/leads/route.ts:1`.
- Implement Resources/Events data fetching from DB and file uploads (S3/R2).
- Add reCAPTCHA v3 or hCaptcha to forms and basic rate limiting.
