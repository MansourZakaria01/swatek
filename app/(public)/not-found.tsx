import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="text-7xl font-extrabold text-gradient mb-4">404</p>
      <h1 className="text-2xl font-bold mb-2">Page not found</h1>
      <p className="text-[--text-muted] mb-8">The page you're looking for doesn't exist or was moved.</p>
      <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[--accent] text-[--background] font-semibold hover:bg-[--accent-dim] transition-colors text-sm">
        <ArrowLeft size={15} /> Back to Home
      </Link>
    </div>
  )
}
