# StayNest — Hotel Booking Platform

Full-stack hotel booking app: browse hotels/rooms, book stays, pay via Stripe, leave reviews, and manage hotels/rooms/bookings as an owner.

## Stack
- **Client**: React 19, Vite, TypeScript, Tailwind CSS v4, TanStack Query, React Router v7, React Hook Form, Clerk (auth), React Hot Toast
- **Server**: Node.js, Express 5, MongoDB (Mongoose), Clerk (auth), Stripe (payments), Cloudinary (images), Nodemailer, Svix (webhooks)

## Project Structure
```
client/   React app (Vite)
server/   Express API
```

## Setup

### 1. Server
```
cd server
npm install
cp config/config.env.example config/config.env   # if example exists, else fill config.env directly
npm run dev
```

Required `server/config/config.env` values:
```
PORT=5000
DB_URI=<mongodb-connection-string>
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SMTP_SERVICE=
SMTP_HOST=
SMTP_PORT=
SMTP_MAIL=
SMTP_PASSWORD=
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### 2. Client
```
cd client
npm install
cp .env.example .env
npm run dev
```

`client/.env`:
```
VITE_API_BASE_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

## Scripts

| Location | Command | Purpose |
|---|---|---|
| client | `npm run dev` | Dev server |
| client | `npm run build` | Type-check + production build |
| client | `npm run lint` | Oxlint |
| client | `npm run preview` | Preview prod build |
| server | `npm run dev` | Nodemon dev server |
| server | `npm start` | Production start |

## Core Flows
- **Guests**: browse hotels/rooms → check availability → book → pay (Stripe) → view/cancel booking → leave/edit/delete review
- **Owners**: register hotel → CRUD rooms (with images) → view bookings & revenue → update booking status

## Auth
Clerk handles sign-in/up. On sign-in, `useSyncUser` syncs the Clerk user into MongoDB via `/api/user/sync`. Clerk webhooks (`/api/clerk`) keep user data in sync on `user.created/updated/deleted`.

## Payments
Stripe Checkout session created via `/api/booking/stripe-payment`. Webhook `/api/stripe` marks bookings paid on `payment_intent.succeeded`. Requires `STRIPE_WEBHOOK_SECRET` and a public HTTPS endpoint (use `stripe listen --forward-to` locally).

## Deployment

### Server (Vercel)
Uses `server/vercel.json`, builds `server.js`. Ensure all env vars from `config.env` are set in Vercel project settings (Vercel does not read `.env` files — set them in the dashboard). Point Stripe/Clerk webhook URLs to the deployed domain.

### Client (Vercel/Netlify)
Standard Vite static build (`npm run build` → `dist/`). Set `VITE_API_BASE_URL` to the deployed server URL and `VITE_CLERK_PUBLISHABLE_KEY` in the platform's env settings.

### Post-deploy checklist
- [ ] CORS on server restricted to production client origin (currently `cors()` allows all — tighten for prod)
- [ ] Clerk webhook endpoint added in Clerk dashboard → `https://<server>/api/clerk`
- [ ] Stripe webhook endpoint added in Stripe dashboard → `https://<server>/api/stripe`
- [ ] MongoDB Atlas IP allowlist includes hosting provider (or `0.0.0.0/0`)
- [ ] Cloudinary credentials valid for image uploads

## Known items to verify locally (Step 8)
- Run `npm run build` in `client/` — confirms TS types pass (owner pages' query error typing was fixed in a prior step).
- Test full booking → Stripe payment → webhook → review flow end-to-end with test keys.
- Test responsiveness at mobile/tablet/desktop breakpoints on: Home, Hotels, Hotel Detail, Room Detail, Booking flow, Owner pages, My Reviews.
- Confirm room image upload/replace works via Cloudinary in both create and edit room forms.
- Confirm cancelled bookings can't be reviewed/paid (already enforced server-side).