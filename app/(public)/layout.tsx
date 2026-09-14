import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { PageTransition } from '@/components/cinematic/PageTransition'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  )
}
