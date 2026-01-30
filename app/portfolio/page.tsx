'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { getUserPortfolio, getAllCharacters } from '@/lib/firebase/firestore';
import { Portfolio, Character } from '@/types';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface PortfolioDisplay {
  character: Character;
  quantity: number;
  averagePurchasePrice: number;
  currentValue: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

export default function PortfolioPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<Portfolio>({});
  const [characters, setCharacters] = useState<Character[]>([]);
  const [portfolioDisplay, setPortfolioDisplay] = useState<PortfolioDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchPortfolioData();
    }
  }, [user]);

  const fetchPortfolioData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch portfolio and characters in parallel
      const [portfolioData, charactersData] = await Promise.all([
        getUserPortfolio(user.id),
        getAllCharacters(),
      ]);

      setPortfolio(portfolioData);
      setCharacters(charactersData);

      // Build portfolio display with profit/loss
      const display: PortfolioDisplay[] = [];

      for (const [characterId, portfolioItem] of Object.entries(portfolioData)) {
        const character = charactersData.find(c => c.id === characterId);

        if (character) {
          const currentValue = character.marketData.currentPrice;
          const totalValue = currentValue * portfolioItem.quantity;
          const totalCost = portfolioItem.averagePurchasePrice * portfolioItem.quantity;
          const profitLoss = totalValue - totalCost;
          const profitLossPercent = (profitLoss / totalCost) * 100;

          display.push({
            character,
            quantity: portfolioItem.quantity,
            averagePurchasePrice: portfolioItem.averagePurchasePrice,
            currentValue,
            totalValue,
            profitLoss,
            profitLossPercent,
          });
        }
      }

      // Sort by total value descending
      display.sort((a, b) => b.totalValue - a.totalValue);
      setPortfolioDisplay(display);

    } catch (error: any) {
      console.error('Error fetching portfolio:', error);
      toast.error('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const totalPortfolioValue = portfolioDisplay.reduce((sum, item) => sum + item.totalValue, 0);
  const totalInvested = portfolioDisplay.reduce(
    (sum, item) => sum + (item.averagePurchasePrice * item.quantity),
    0
  );
  const totalProfitLoss = totalPortfolioValue - totalInvested;
  const totalProfitLossPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;
  const totalAccountValue = user.balance + totalPortfolioValue;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl">←</span>
            <h1 className="text-3xl font-bold text-purple-600">My Portfolio</h1>
          </Link>
          <Link
            href="/characters"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
          >
            Browse Characters
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Portfolio Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* Total Account Value */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-sm font-semibold opacity-90 mb-2">Total Account Value</h3>
            <p className="text-3xl font-bold">£{totalAccountValue.toLocaleString()}</p>
            <p className="text-xs opacity-75 mt-2">Cash + Holdings</p>
          </div>

          {/* Cash Balance */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-sm font-semibold opacity-90 mb-2">Cash Balance</h3>
            <p className="text-3xl font-bold">£{user.balance.toLocaleString()}</p>
            <p className="text-xs opacity-75 mt-2">Available to invest</p>
          </div>

          {/* Portfolio Value */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-sm font-semibold opacity-90 mb-2">Holdings Value</h3>
            <p className="text-3xl font-bold">£{totalPortfolioValue.toLocaleString()}</p>
            <p className="text-xs opacity-75 mt-2">{portfolioDisplay.length} characters</p>
          </div>

          {/* Total Profit/Loss */}
          <div className={`bg-gradient-to-br ${totalProfitLoss >= 0 ? 'from-emerald-500 to-emerald-600' : 'from-red-500 to-red-600'} rounded-2xl p-6 text-white shadow-lg`}>
            <h3 className="text-sm font-semibold opacity-90 mb-2">Total P/L</h3>
            <p className="text-3xl font-bold">
              {totalProfitLoss >= 0 ? '+' : ''}£{totalProfitLoss.toLocaleString()}
            </p>
            <p className="text-xs opacity-75 mt-2">
              {totalProfitLoss >= 0 ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Portfolio Holdings */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Characters</h2>
            <button
              onClick={fetchPortfolioData}
              disabled={loading}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              🔄 Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : portfolioDisplay.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Characters Yet</h3>
              <p className="text-gray-600 mb-6">
                Start building your portfolio by buying your first character!
              </p>
              <Link
                href="/characters"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
              >
                Browse Marketplace
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {portfolioDisplay.map((item) => (
                <div
                  key={item.character.id}
                  className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    {/* Character Info */}
                    <div className="flex items-center space-x-6 flex-1">
                      <div className="text-6xl">{item.character.imageUrl}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">
                            {item.character.name}
                          </h3>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {item.character.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {item.character.companySymbol} • {item.character.companyName}
                        </p>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-5 gap-6 text-right">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Quantity</p>
                        <p className="text-lg font-bold text-gray-800">{item.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Avg. Cost</p>
                        <p className="text-lg font-bold text-gray-800">
                          £{item.averagePurchasePrice.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Current Price</p>
                        <p className="text-lg font-bold text-gray-800">
                          £{item.currentValue.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Value</p>
                        <p className="text-lg font-bold text-gray-800">
                          £{item.totalValue.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Profit/Loss</p>
                        <p className={`text-lg font-bold ${item.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.profitLoss >= 0 ? '+' : ''}£{item.profitLoss.toLocaleString()}
                        </p>
                        <p className={`text-xs font-semibold ${item.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.profitLoss >= 0 ? '+' : ''}{item.profitLossPercent.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Performance Summary */}
        {portfolioDisplay.length > 0 && (
          <div className="mt-8 bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Portfolio Summary</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Investment Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Invested</span>
                    <span className="font-semibold text-gray-800">
                      £{totalInvested.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Value</span>
                    <span className="font-semibold text-gray-800">
                      £{totalPortfolioValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="font-semibold text-gray-800">Net Profit/Loss</span>
                    <span className={`font-bold ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalProfitLoss >= 0 ? '+' : ''}£{totalProfitLoss.toLocaleString()} ({totalProfitLoss >= 0 ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Performer</h3>
                {portfolioDisplay.length > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">{portfolioDisplay.sort((a, b) => b.profitLoss - a.profitLoss)[0].character.imageUrl}</span>
                      <div>
                        <p className="font-bold text-gray-800">
                          {portfolioDisplay.sort((a, b) => b.profitLoss - a.profitLoss)[0].character.name}
                        </p>
                        <p className="text-sm text-green-600 font-semibold">
                          +£{portfolioDisplay.sort((a, b) => b.profitLoss - a.profitLoss)[0].profitLoss.toLocaleString()} gain
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
