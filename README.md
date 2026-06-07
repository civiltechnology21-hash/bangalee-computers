# Bangalee Computers — বাঙালী কম্পিউটার্স

> **Your Technology Partner ❤️** — Digital catalog + lead generation website for a computer & laptop shop in Khulna, Bangladesh.

**Monthly cost: ৳0** (Supabase free tier + Vercel free tier)

---

## Tech Stack

| Layer      | Tool                              |
|------------|-----------------------------------|
| Framework  | Next.js 14 (App Router)           |
| Styling    | Tailwind CSS                      |
| Database   | Supabase (PostgreSQL + Auth)      |
| Hosting    | Vercel                            |
| Fonts      | Outfit + Hind Siliguri (Google)   |

---

## Features

### Public
- 🏠 Homepage with hero, stats, featured products, services
- 💻 Product catalog with category filter + keyword search
- 🔧 Services page
- 📖 About page with Google Maps embed
- 📞 Contact form → saves to Supabase
- 📱 Mobile-first, Android-optimized
- ✅ WhatsApp CTAs with pre-filled product messages
- ⚠️ Prominent "no online payment" notice

### Admin (protected)
- 🔑 Email/password login via Supabase Auth
- 💬 View & manage customer inquiries (mark seen/unseen, delete)
- 📦 Full product CRUD (add, edit, delete, toggle stock/featured)

---

## Deployment (5 steps)

### 1. Supabase Setup

1. Create free account → [supabase.com](https://supabase.com)
2. New Project → choose any region
3. Go to **SQL Editor** → paste and run `supabase/schema.sql`
4. Go to **Project Settings → API** → copy:
   - `Project URL`
   - `anon public` key

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Run Locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

### 4. Deploy to Vercel

1. Push code to GitHub
2. [vercel.com](https://vercel.com) → New Project → Import repo
3. Add environment variables (same as `.env.local`)
4. Deploy → done ✅

### 5. Create Admin Account

1. Supabase Dashboard → **Authentication → Users**
2. Click **Invite User** → enter email + password
3. Go to `/admin/login` → sign in

---

## Project Structure

```
bangalee-computers/
├── src/
│   ├── app/
│   │   ├── (public)/          # Public routes (Navbar + Footer)
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── products/      # Product catalog
│   │   │   ├── services/      # Services
│   │   │   ├── about/         # About
│   │   │   └── contact/       # Contact form
│   │   └── admin/             # Protected admin panel
│   │       ├── login/         # Auth page
│   │       ├── messages/      # Customer inquiries
│   │       └── products/      # Product CRUD
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── FloatingWA.tsx     # Floating WhatsApp button
│   │   ├── ProductCard.tsx
│   │   └── PolicyNotice.tsx
│   └── lib/
│       ├── supabase.ts        # Supabase client + types
│       └── constants.ts       # Business data, categories
└── supabase/
    └── schema.sql             # DB schema + seed data + RLS
```

---

## Business Rules (enforced in code)

- ❌ No "Buy Now" button anywhere
- ❌ No shopping cart, no payment gateway
- ✅ Every product has WhatsApp + Call CTAs
- ✅ "আমরা অনলাইনে কোনো পণ্য বিক্রয় করি না" notice on every page
- ✅ Friday shown as holiday
- ✅ WhatsApp links pre-fill product name in message

---

## Business Contact

**Phone:** 01991-944447 / 01971-964546  
**WhatsApp:** https://wa.me/8801991944447  
**Address:** Ground Floor, Tiger Garden International Hotel, 1 KDA Avenue, Shibbari More, Khulna 9100  
**Facebook:** https://www.facebook.com/bangalee.computers
