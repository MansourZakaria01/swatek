import type { Metadata } from 'next'
import { Syne, Outfit } from 'next/font/google'
import './globals.css'
import { ScrollProgress } from '@/components/cinematic/ScrollProgress'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['500', '600', '700', '800'],
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'SWATEK — Smart Waves Technologies', template: '%s | SWATEK' },
  description: 'Industry 4.0, AI, clean energy, smart agriculture, and circular economy solutions for sustainable industrial transformation.',
  keywords: ['Industry 4.0', 'AI', 'IoT', 'green hydrogen', 'smart agriculture', 'smart buildings', 'circular economy'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased">
        <ScrollProgress />
        {children}
      </body>
    </html>
  )
}
