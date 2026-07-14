export const BUSINESS = {
  nameEn:     'Bangalee Computers',
  nameBn:     'বাঙালী কম্পিউটার্স',
  tagline:    'Your Technology Partner ❤️',
  phone1:     '01991-944447',
  phone2:     '01971-964546',
  whatsapp:   'https://wa.me/8801991944447',
  address:    'Ground Floor, Tiger Garden International Hotel, 1 KDA Avenue, Shibbari More, Khulna 9100, Bangladesh',
  addressBn:  'গ্রাউন্ড ফ্লোর, টাইগার গার্ডেন ইন্টারন্যাশনাল হোটেল, ১ কেডিএ এভিনিউ, শিববাড়ি মোড়, খুলনা ৯১০০',
  facebook:   'https://www.facebook.com/bangalee.computers',
  youtube:    'https://www.youtube.com/@Bangalee_Computers_Khulna',
  instagram:  'https://www.instagram.com/bangalee_computers_khulna',
  maps:       'https://maps.google.com/?q=Bangalee+Computers+Khulna',
  mapsEmbed:  'https://maps.google.com/maps?q=Bangalee+Computers+Khulna&output=embed',
  hours: {
    weekdays: 'শনি – বৃহস্পতি: সকাল – রাত ১০:০০',
    friday:   'শুক্রবার: বন্ধ',
  },
  fbFollowers:    '৩৪,০০০+',
  fbRating:       '৪.৭/৫',
  googleRating:   '৩.৬/৫',
  yearsInBusiness:'৫+',
}

export const NAV_LINKS = [
  { href: '/',          label: 'হোম',      labelEn: 'Home' },
  { href: '/products',  label: 'প্রোডাক্ট', labelEn: 'Products' },
  { href: '/services',  label: 'সার্ভিস',   labelEn: 'Services' },
  { href: '/about',     label: 'আমাদের',    labelEn: 'About' },
  { href: '/contact',   label: 'যোগাযোগ',   labelEn: 'Contact' },
]

export const CATEGORY_LABELS: Record<string, { bn: string; en: string; badge: string }> = {
  new:         { bn: 'নতুন ল্যাপটপ',     en: 'New Laptop',    badge: 'badge-new' },
  used:        { bn: 'পুরনো ল্যাপটপ',    en: 'Used Laptop',   badge: 'badge-used' },
  accessories: { bn: 'আনুষাঙ্গিক',       en: 'Accessories',   badge: 'badge-accessories' },
  services:    { bn: 'সার্ভিস',           en: 'Services',      badge: 'badge-services' },
}

export const SERVICES = [
  { icon: '🔧', title: 'Laptop Repair & Servicing',  titleBn: 'ল্যাপটপ মেরামত ও সার্ভিসিং', desc: 'সব ধরনের হার্ডওয়্যার ও সফটওয়্যার সমস্যার সমাধান' },
  { icon: '💿', title: 'OS Installation',             titleBn: 'অপারেটিং সিস্টেম ইনস্টলেশন',  desc: 'Windows 10 / 11 ইনস্টলেশন এবং কনফিগারেশন' },
  { icon: '⚡', title: 'SSD Upgrade',                 titleBn: 'এসএসডি আপগ্রেড',               desc: 'পুরনো HDD থেকে SSD তে আপগ্রেড করে স্পিড বাড়ান' },
  { icon: '🖥️', title: 'Screen Replacement',         titleBn: 'স্ক্রিন রিপ্লেসমেন্ট',         desc: 'ভাঙা বা ক্ষতিগ্রস্ত ল্যাপটপ স্ক্রিন প্রতিস্থাপন' },
  { icon: '🧩', title: 'RAM Upgrade',                 titleBn: 'র‍্যাম আপগ্রেড',                desc: 'ল্যাপটপের পারফরম্যান্স বাড়াতে RAM আপগ্রেড' },
  { icon: '🔋', title: 'Battery Replacement',        titleBn: 'ব্যাটারি রিপ্লেসমেন্ট',        desc: 'অরিজিনাল ও কমপ্যাটিবল ব্যাটারি পরিবর্তন' },
]

export const WA_PRODUCT_MSG = (name: string) =>
  encodeURIComponent(`আমি ${name} সম্পর্কে জানতে চাই`)

export const NOTICE_BN = 'আমরা অনলাইনে কোনো পণ্য বিক্রয় করি না এবং অগ্রিম কোনো টাকা গ্রহণ করি না।'
