'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { getCharacter, buyCharacter } from '@/lib/firebase/firestore';
import { getUserData } from '@/lib/firebase/auth';
import { Character } from '@/types';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CharacterDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const characterId = params.id as string;

  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && characterId) {
      fetchCharacter();
    }
  }, [user, characterId]);

  const fetchCharacter = async () => {
    try {
      setLoading(true);
      const data = await getCharacter(characterId);
      if (!data) {
        toast.error('Character not found');
        router.push('/characters');
        return;
      }
      setCharacter(data);
    } catch (error: any) {
      console.error('Error fetching character:', error);
      toast.error('Failed to load character');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!character || !user) return;

    const totalCost = character.marketData.currentPrice * quantity;

    if (totalCost > user.balance) {
      toast.error('Insufficient balance!');
      return;
    }

    setPurchasing(true);

    try {
      await buyCharacter(user.id, characterId, quantity);

      toast.success(`🎉 Successfully purchased ${quantity}x ${character.name}!`);

      // Refresh user data to show updated balance
      const updatedUser = await getUserData(user.id);
      if (updatedUser) {
        // The useAuth hook will pick up the change
        window.location.reload();
      }

      // Redirect to portfolio/dashboard after a moment
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast.error(error.message || 'Failed to purchase character');
    } finally {
      setPurchasing(false);
    }
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRarityGradient = (rarity?: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  if (authLoading || !user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Character not found</p>
          <Link href="/characters" className="text-purple-600 hover:text-purple-700 underline">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const totalCost = character.marketData.currentPrice * quantity;
  const canAfford = totalCost <= user.balance;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/characters" className="flex items-center space-x-2">
            <span className="text-2xl">←</span>
            <h1 className="text-2xl font-bold text-purple-600">Back to Marketplace</h1>
          </Link>
          <div className="text-right">
            <p className="text-sm text-gray-600">Your Balance</p>
            <p className="font-bold text-green-600 text-xl">£{user.balance.toLocaleString()}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Character Info */}
          <div>
            {/* Character Card */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className={`bg-gradient-to-r ${getRarityGradient(character.rarity)} p-12 text-center`}>
                <div className="text-9xl mb-4">{character.imageUrl}</div>
                <h2 className="text-3xl font-bold text-white mb-2">{character.name}</h2>
                <p className="text-lg text-white opacity-90">{character.companyName}</p>
                <p className="text-sm text-white opacity-75 mt-2">{character.companySymbol}</p>
              </div>

              <div className="p-8">
                {/* Badges */}
                <div className="flex gap-3 mb-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getRarityColor(character.rarity)}`}>
                    {character.rarity?.toUpperCase() || 'COMMON'}
                  </span>
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {character.type}
                  </span>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">About</h3>
                  <p className="text-gray-600 leading-relaxed">{character.description}</p>
                </div>

                {/* Abilities */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Special Abilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {character.abilities.map((ability, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                      >
                        ✨ {ability}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Market Stats */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Market Data</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Market Cap</p>
                      <p className="font-semibold text-gray-800">
                        £{(character.marketData.marketCap || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Trading Volume</p>
                      <p className="font-semibold text-gray-800">
                        {(character.marketData.volume || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Purchase */}
          <div>
            <div className="bg-white rounded-3xl shadow-2xl p-8 sticky top-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Purchase Character</h3>

              {/* Current Price */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2">Current Price</p>
                <p className="text-4xl font-bold text-green-600">
                  £{character.marketData.currentPrice.toLocaleString()}
                </p>
                <div className="flex items-center mt-3">
                  <span className={`text-sm font-semibold ${character.marketData.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {character.marketData.priceChange >= 0 ? '↑' : '↓'} {character.marketData.priceChange >= 0 ? '+' : ''}
                    {character.marketData.priceChangePercent.toFixed(2)}% (24h)
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-xl transition"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    className="w-20 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg py-2"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-xl transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Cost */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-800">
                    £{totalCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Transaction Fee</span>
                  <span className="font-semibold text-gray-800">£0</span>
                </div>
                <div className="flex items-center justify-between text-xl">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="font-bold text-purple-600">
                    £{totalCost.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Balance Check */}
              {!canAfford && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-700 text-sm">
                    ⚠️ Insufficient balance! You need £{(totalCost - user.balance).toLocaleString()} more.
                  </p>
                </div>
              )}

              {/* Purchase Button */}
              <button
                onClick={handlePurchase}
                disabled={!canAfford || purchasing}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {purchasing ? 'Processing...' : canAfford ? `Buy ${quantity}x ${character.name}` : 'Insufficient Balance'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                * Prices are simulated and for educational purposes only
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
