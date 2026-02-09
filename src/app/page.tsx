import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Database, FileText } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center font-serif font-bold text-xl" href="#">
          Agentic Resume
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4 flex items-center" href="/login">
            Login
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none font-serif">
                  The Resume That <span className="text-primary">Adapts</span> To Every Job
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Stop sending static PDFs. Build a "Career Vault" and let AI tailor your resume for every single application instantly.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/login">
                  <Button size="lg" className="h-12 px-8">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="https://github.com/inbarajb91-cloud/agentic-resume" target="_blank">
                  <Button variant="outline" size="lg" className="h-12 px-8">
                    View on GitHub
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-white dark:bg-gray-900 rounded-full shadow-lg">
                  <Database className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Career Vault</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Store your Master Experience once. Never re-type your bullets again.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-white dark:bg-gray-900 rounded-full shadow-lg">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-xl font-bold">AI Tailoring</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Gemini analyzes the Job Description and rewrites your resume to match perfect keywords.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-white dark:bg-gray-900 rounded-full shadow-lg">
                  <FileText className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Recruiter Tracking</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Know exactly when a recruiter views your resume and how long they stay.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Agentic Resume. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
