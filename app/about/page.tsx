import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            InvestiMon
          </Link>
          <div className="space-x-4">
            <Link
              href="/auth/login"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* About Content */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-8">
            About InvestiMon
          </h1>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                InvestiMon is designed to make financial literacy fun and accessible for
                children aged 7-14. We believe that learning about money, investing, and
                financial responsibility should be an exciting adventure, not a boring lesson.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold text-blue-600 mb-2">1. Create Your Account</h3>
                  <p className="text-gray-700">
                    Sign up as a child or parent and start with virtual currency to practice
                    investing in a safe environment.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold text-blue-600 mb-2">2. Complete Challenges</h3>
                  <p className="text-gray-700">
                    Take on daily challenges that teach investment concepts, earn experience
                    points, and level up your knowledge.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold text-blue-600 mb-2">3. Collect Characters</h3>
                  <p className="text-gray-700">
                    Build your collection of InvestiMon characters, each representing different
                    investment strategies and financial concepts.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold text-blue-600 mb-2">4. Build Your Portfolio</h3>
                  <p className="text-gray-700">
                    Practice making investment decisions with virtual money, track your progress,
                    and learn from your successes and mistakes.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">For Parents</h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-4">
                InvestiMon provides parents with tools to guide their children's financial
                education:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Monitor your child's progress and achievements</li>
                <li>Set spending limits and trading permissions</li>
                <li>Review completed challenges and learning outcomes</li>
                <li>Receive insights into your child's financial understanding</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Financial Literacy Matters</h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                Financial literacy is one of the most important life skills, yet it's rarely
                taught in schools. By starting early with InvestiMon, children develop:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mt-4 ml-4">
                <li>Understanding of basic investing concepts</li>
                <li>Critical thinking about money and value</li>
                <li>Patience and long-term planning skills</li>
                <li>Confidence in making financial decisions</li>
              </ul>
            </section>

            <section className="bg-blue-600 text-white rounded-2xl p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8">
                Join thousands of kids learning financial literacy through InvestiMon
              </p>
              <Link
                href="/auth/register"
                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Create Free Account
              </Link>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>&copy; 2026 InvestiMon. Making financial literacy fun for kids.</p>
          <div className="mt-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700 mx-2">
              Home
            </Link>
            <Link href="/about" className="text-blue-600 hover:text-blue-700 mx-2">
              About
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
