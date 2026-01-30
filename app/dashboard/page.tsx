'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from '@/lib/firebase/auth';
import { getUserPortfolio } from '@/lib/firebase/firestore';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    // Redirect unauthenticated users
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Fetch portfolio to get character count
    if (user) {
      getUserPortfolio(user.id)
        .then(portfolio => {
          const count = Object.keys(portfolio).length;
          setCharacterCount(count);
        })
        .catch(err => console.error('Error fetching portfolio:', err));
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-purple-600">
              🎮 InvestiMon
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-bold text-gray-800">{user.name}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                Welcome to Your Dashboard! 👋
              </h2>
              <p className="text-xl text-gray-600">
                {user.role === 'parent'
                  ? "Monitor your child's investing journey"
                  : "Ready to start your investing adventure?"}
              </p>
            </div>
            <div className="text-6xl">
              {user.role === 'parent' ? '👨‍👩‍👧' : '🎯'}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Balance</h3>
              <span className="text-3xl">💰</span>
            </div>
            <p className="text-4xl font-bold">
              £{user.balance.toLocaleString()}
            </p>
            <p className="text-sm opacity-90 mt-2">Available to invest</p>
          </div>

          {/* Level Card */}
          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Level</h3>
              <span className="text-3xl">⭐</span>
            </div>
            <p className="text-4xl font-bold">Level {user.level}</p>
            <div className="mt-4">
              <div className="bg-white bg-opacity-30 rounded-full h-3">
                <div
                  className="bg-white rounded-full h-3 transition-all"
                  style={{ width: `${(user.experience % 1000) / 10}%` }}
                />
              </div>
              <p className="text-sm opacity-90 mt-2">
                {user.experience} XP / {user.level * 1000} XP to next level
              </p>
            </div>
          </div>

          {/* Portfolio Card */}
          <Link href="/portfolio" className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Portfolio</h3>
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-4xl font-bold">{characterCount}</p>
            <p className="text-sm opacity-90 mt-2">Characters owned</p>
          </Link>
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            🎯 Quick Actions
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/characters" className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl p-6 text-center transition-all transform hover:scale-105 shadow-lg">
              <div className="text-5xl mb-3">📈</div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Character Marketplace
              </h4>
              <p className="text-white text-sm opacity-90">
                Browse and buy company characters
              </p>
            </Link>

            <Link href="/portfolio" className="bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl p-6 text-center transition-all transform hover:scale-105 shadow-lg">
              <div className="text-5xl mb-3">💼</div>
              <h4 className="text-lg font-semibold text-white mb-2">
                My Portfolio
              </h4>
              <p className="text-white text-sm opacity-90">
                View your characters and profits
              </p>
            </Link>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <div className="text-5xl mb-3">🎯</div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Challenges
              </h4>
              <p className="text-gray-600">
                Complete quests and earn rewards
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <div className="text-5xl mb-3">📰</div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Market News
              </h4>
              <p className="text-gray-600">
                Stay updated with kid-friendly news
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <div className="text-5xl mb-3">💼</div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Portfolio Management
              </h4>
              <p className="text-gray-600">
                Track your investments and profits
              </p>
            </div>
          </div>
        </div>

        {/* User Info (Debug) */}
        <div className="mt-8 bg-gray-100 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">
            Your Account Info
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <span className="ml-2 text-gray-800">{user.email}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Role:</span>
              <span className="ml-2 text-gray-800 capitalize">{user.role}</span>
            </div>
            {user.age && (
              <div>
                <span className="font-medium text-gray-600">Age:</span>
                <span className="ml-2 text-gray-800">{user.age}</span>
              </div>
            )}
            <div>
              <span className="font-medium text-gray-600">User ID:</span>
              <span className="ml-2 text-gray-800 font-mono text-xs">{user.id}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
