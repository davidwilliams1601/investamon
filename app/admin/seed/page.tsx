'use client';

import { useState } from 'react';
import { uploadSeedCharacters } from '@/lib/firebase/uploadCharacters';
import toast from 'react-hot-toast';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!confirm('Are you sure you want to upload seed characters? This will add/overwrite character data in Firestore.')) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await uploadSeedCharacters();
      setResult(`✅ Successfully uploaded ${response.count} characters!`);
      toast.success('Characters uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      setResult(`❌ Error: ${error.message}`);
      toast.error('Failed to upload characters');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🔧 Admin: Seed Characters
        </h1>
        <p className="text-gray-600 mb-6">
          Upload the initial 12 characters to Firestore. This will create the characters collection
          with all the seed data.
        </p>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Uploading...' : '📤 Upload Seed Characters'}
        </button>

        {result && (
          <div className={`mt-6 p-4 rounded-lg ${result.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className="font-mono text-sm whitespace-pre-wrap">{result}</p>
          </div>
        )}

        <div className="mt-8 text-sm text-gray-600">
          <p className="font-semibold mb-2">What this does:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Creates 12 characters in Firestore</li>
            <li>Includes: Tech, Food, Auto, E-Commerce, Healthcare, etc.</li>
            <li>Price range: £650 - £5,000</li>
            <li>Different rarity levels (Common to Legendary)</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <a href="/dashboard" className="text-purple-600 hover:text-purple-700 underline">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
