-- =============================================
-- Bangalee Computers — Supabase Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Products table
create table if not exists products (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  name_bn     text,
  category    text check (category in ('new', 'used', 'accessories', 'services')),
  specs       text,
  price       text,
  image_url   text,
  in_stock    boolean default true,
  featured    boolean default false,
  created_at  timestamp with time zone default now()
);

-- Inquiries table (contact form submissions)
create table if not exists inquiries (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  phone       text not null,
  category    text,
  message     text,
  seen        boolean default false,
  created_at  timestamp with time zone default now()
);

-- =============================================
-- Row Level Security
-- =============================================

alter table products enable row level security;
alter table inquiries enable row level security;

-- Products: public can read, only authenticated (admin) can write
create policy "Public read products"
  on products for select
  using (true);

create policy "Authenticated insert products"
  on products for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated update products"
  on products for update
  using (auth.role() = 'authenticated');

create policy "Authenticated delete products"
  on products for delete
  using (auth.role() = 'authenticated');

-- Inquiries: public can insert, only authenticated (admin) can read/update
create policy "Public insert inquiries"
  on inquiries for insert
  with check (true);

create policy "Authenticated read inquiries"
  on inquiries for select
  using (auth.role() = 'authenticated');

create policy "Authenticated update inquiries"
  on inquiries for update
  using (auth.role() = 'authenticated');

create policy "Authenticated delete inquiries"
  on inquiries for delete
  using (auth.role() = 'authenticated');

-- =============================================
-- Seed Sample Products
-- =============================================

-- To update these values, edit the rows directly in Supabase Table Editor.
-- Add years_in_business row to the settings table:
--   INSERT INTO settings (key, value) VALUES ('years_in_business', '৫');
-- (Run this once in Supabase SQL Editor if the settings table already exists)

insert into products (name, name_bn, category, specs, price, in_stock, featured) values
  ('Lenovo IdeaPad 3',    'লেনোভো আইডিয়াপ্যাড ৩',  'new',         'Core i5 12th Gen | 8GB RAM | 512GB SSD | 15.6" FHD',   '৳42,000',  true, true),
  ('Asus VivoBook 15',    'আসুস ভিভোবুক ১৫',         'new',         'Core i3 12th Gen | 8GB RAM | 256GB SSD | 15.6" FHD',   '৳38,500',  true, true),
  ('HP 15s',              'এইচপি ১৫এস',               'new',         'AMD Ryzen 5 | 8GB RAM | 512GB SSD | 15.6" FHD',        '৳45,000',  true, true),
  ('Dell Latitude E7470', 'ডেল ল্যাটিটিউড',           'used',        'Core i5 6th Gen | 8GB RAM | 256GB SSD | 14" FHD',      '৳22,000',  true, true),
  ('HP EliteBook 840 G3', 'এইচপি এলিটবুক ৮৪০',       'used',        'Core i5 6th Gen | 8GB RAM | 256GB SSD | 14" FHD',      '৳20,000',  true, true),
  ('Lenovo ThinkPad T460','লেনোভো থিংকপ্যাড',         'used',        'Core i5 6th Gen | 8GB RAM | 256GB SSD | 14" HD',       '৳18,500',  true, true),
  ('Mechanical Keyboard', 'মেকানিক্যাল কীবোর্ড',     'accessories', 'RGB Backlit | TKL Layout | Blue Switch',               '৳1,500',   true, false),
  ('Wireless Mouse',      'ওয়্যারলেস মাউস',           'accessories', '2.4GHz Wireless | Ergonomic | DPI Adjustable',         '৳800',     true, false);
