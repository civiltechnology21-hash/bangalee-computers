import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bangalee Computers | বাঙালী কম্পিউটার্স — Khulna',
  description: 'Bangalee Computers — Your Technology Partner in Khulna. New & used laptops, accessories, repair services. Japan/Singapore imported refurbished laptops. Call: 01991-944447',
  keywords: 'laptop shop khulna, used laptop khulna, refurbished laptop bangladesh, computer shop khulna, বাঙালী কম্পিউটার্স',
  icons: {
    icon:  '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Bangalee Computers | বাঙালী কম্পিউটার্স',
    description: 'Your Technology Partner in Khulna, Bangladesh',
    locale: 'bn_BD',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Hind+Siliguri:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
