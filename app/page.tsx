import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">InvestiMon</div>
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

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Learn Investing Through{' '}
            <span className="text-blue-600">Fun Adventures</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            InvestiMon makes learning about money, investing, and financial literacy
            an exciting journey for kids aged 7-14. Collect characters, complete challenges,
            and build your investment portfolio!
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Learning Free
            </Link>
            <Link
              href="/about"
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Gamified Learning</h3>
            <p className="text-gray-600">
              Complete challenges, earn XP, level up, and unlock new characters
              as you learn investing concepts.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">👾</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Collect Characters</h3>
            <p className="text-gray-600">
              Build your collection of unique InvestiMon characters, each representing
              different investment concepts.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Safe Portfolio</h3>
            <p className="text-gray-600">
              Practice investing with virtual money in a safe, educational environment
              designed for kids.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Daily Challenges</h3>
            <p className="text-gray-600">
              Take on new challenges every day to reinforce learning and earn rewards
              for your portfolio.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Parent Dashboard</h3>
            <p className="text-gray-600">
              Parents can track progress, set goals, and guide their children's
              financial education journey.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Achievements</h3>
            <p className="text-gray-600">
              Unlock badges and achievements as you master different aspects of
              investing and financial literacy.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center bg-blue-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of kids learning financial literacy through InvestiMon
          </p>
          <Link
            href="/auth/register"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>&copy; 2026 InvestiMon. Making financial literacy fun for kids.</p>
        </div>
      </footer>
    </div>
  );
}
