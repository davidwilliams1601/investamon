'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function FixAccountPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'child' | 'parent'>('child');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFix = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sign in with the existing account
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user document already exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        toast.success('Account already has data! Redirecting to dashboard...');
        router.push('/dashboard');
        return;
      }

      // Create the missing Firestore document
      const userData: any = {
        email,
        name: name || user.displayName || 'User',
        role,
        ...(age && { age: parseInt(age) }),
        balance: 10000,
        experience: 0,
        level: 1,
        createdAt: serverTimestamp(),
        settings: {
          notifications: true,
          allowTrading: true,
          ...(role === 'child' && { spendingLimit: 1000 }),
          ageGroup: age ? (parseInt(age) <= 9 ? 'younger' : parseInt(age) <= 12 ? 'middle' : 'older') : 'middle',
        },
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      toast.success('Account fixed! Redirecting to dashboard...');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (error: any) {
      console.error('Fix account error:', error);
      toast.error(error.message || 'Failed to fix account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 via-teal-500 to-blue-500 px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Fix Your Account 🔧
          </h1>
          <p className="text-gray-600">
            Complete your account setup by providing missing information
          </p>
        </div>

        <form onSubmit={handleFix} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              placeholder="Your password"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a...
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('child')}
                className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                  role === 'child'
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-300 text-gray-700 hover:border-teal-300'
                }`}
              >
                👦 Child (7-14)
              </button>
              <button
                type="button"
                onClick={() => setRole('parent')}
                className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                  role === 'parent'
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-300 text-gray-700 hover:border-teal-300'
                }`}
              >
                👨‍👩‍👧 Parent
              </button>
            </div>
          </div>

          {role === 'child' && (
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                id="age"
                type="number"
                min="7"
                max="14"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                placeholder="Enter your age (7-14)"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-semibold text-lg hover:from-green-600 hover:to-teal-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Fixing Account...' : 'Fix My Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>This will create your user profile in the database.</p>
        </div>
      </div>
    </div>
  );
}
