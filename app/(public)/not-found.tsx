import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AmbientBackdrop } from '@/components/cinematic/AmbientBackdrop'

export default function NotFoundPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      <AmbientBackdrop />
      <div className="relative z-10">
        <p className="font-display text-[8rem] leading-none font-extrabold text-gradient mb-4 glow-text">404</p>
        <h1 className="font-display text-2xl font-bold mb-3">Scene not found</h1>
        <p className="text-[--text-muted] mb-10 max-w-md">The page you&apos;re looking for doesn&apos;t exist or was moved off-camera.</p>
        <Link href="/" className="btn-cinematic btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-colors text-sm">
          <ArrowLeft size={15} /> Back to Home
        </Link>
      </div>
    </div>
  )
}
