import type { Metadata } from 'next'
import './globals.css'
import { ScrollProgress } from '@/components/cinematic/ScrollProgress'

export const metadata: Metadata = {
  title: { default: 'SWATEK — Smart Waves Technologies', template: '%s | SWATEK' },
  description: 'Industry 4.0, AI, clean energy, smart agriculture, and circular economy solutions for sustainable industrial transformation.',
  keywords: ['Industry 4.0', 'AI', 'IoT', 'green hydrogen', 'smart agriculture', 'smart buildings', 'circular economy'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ScrollProgress />
        {children}
      </body>
    </html>
  )
}
