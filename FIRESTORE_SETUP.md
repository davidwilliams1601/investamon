# Firestore Setup Guide

## ✅ What's Been Configured

### Firebase Project
- **Project ID:** `investamon-43293`
- **Project Name:** Investamon
- **Auth Domain:** `investamon-43293.firebaseapp.com`

### Files Created

1. **`client/src/firebase/config.js`**
   - Firebase initialization
   - Firestore, Auth, and Analytics setup

2. **`client/src/firebase/authService.js`**
   - User registration and login
   - Firebase Authentication integration
   - User document creation in Firestore

3. **`client/src/firebase/portfolioService.js`**
   - `buyStock()` - Buy stocks with proper transactions
   - `sellStock()` - Sell stocks with proper transactions
   - `getPortfolio()` - Retrieve user portfolio
   - `getTransactions()` - Get transaction history
   - **✅ Fixed:** All reads before writes in transactions

4. **`migrate_to_firestore.py`**
   - Script to migrate data from MongoDB to Firestore
   - Migrates users, characters, and transactions

## 🔧 Next Steps

### 1. Download Service Account Key

To use Firebase Admin SDK and run migrations:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **investamon-43293**
3. Click ⚙️ Settings → Project Settings
4. Go to "Service Accounts" tab
5. Click "Generate new private key"
6. Save as `serviceAccountKey.json` in project root
7. **⚠️ NEVER commit this file to git** (already in .gitignore)

### 2. Initialize Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select **investamon-43293**
3. Click "Firestore Database" in left sidebar
4. Click "Create database"
5. Choose **Production mode** or **Test mode**
6. Select a location (us-central1 recommended)

### 3. Set Up Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Anyone can read characters
    match /characters/{characterId} {
      allow read: if true;
      allow write: if false; // Only admins via backend
    }

    // Users can only read their own transactions
    match /transactions/{transactionId} {
      allow read: if request.auth != null &&
                     resource.data.userId == request.auth.uid;
      allow write: if false; // Only created via backend
    }
  }
}
```

### 4. Enable Firebase Authentication

1. In Firebase Console → Authentication
2. Click "Get started"
3. Enable "Email/Password" sign-in method
4. (Optional) Enable other providers: Google, etc.

### 5. Install Firebase SDK

The Firebase SDK needs to be installed in the client:

```bash
cd client
npm install firebase
```

### 6. Build React App

```bash
cd client
npm run build
```

### 7. Migrate Data (Optional)

If you have existing MongoDB data:

```bash
# Make sure serviceAccountKey.json is in place
python migrate_to_firestore.py
```

### 8. Deploy to Vercel

#### Option A: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd client
vercel --prod
```

#### Option B: Via GitHub

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import from GitHub: `ideasdavid/calculator`
4. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
5. Add Environment Variables (optional):
   - `REACT_APP_FIREBASE_API_KEY`
   - `REACT_APP_FIREBASE_PROJECT_ID`
   - etc.
6. Click "Deploy"

## 📁 Firestore Collections Structure

### `users/{userId}`
```javascript
{
  email: string,
  name: string,
  role: "parent" | "child",
  age: number,
  balance: number,
  portfolio: [
    {
      characterId: string,
      characterName: string,
      quantity: number,
      averagePurchasePrice: number,
      purchasedAt: timestamp
    }
  ],
  experience: number,
  level: number,
  createdAt: timestamp
}
```

### `characters/{characterId}`
```javascript
{
  name: string,
  companySymbol: string,
  companyName: string,
  type: string,
  description: string,
  imageUrl: string,
  level: number,
  experience: number,
  traits: {
    resilience: number,
    growth: number,
    momentum: number,
    stability: number
  },
  marketData: {
    currentPrice: number,
    priceChange: number,
    priceChangePercent: number,
    lastUpdated: timestamp
  },
  evolution: object,
  createdAt: timestamp
}
```

### `transactions/{transactionId}`
```javascript
{
  userId: string,
  characterId: string,
  characterName: string,
  type: "buy" | "sell",
  quantity: number,
  price: number,
  total: number,
  profitLoss: number, // for sells only
  timestamp: timestamp
}
```

## 🐛 Troubleshooting

### "Firestore transactions require all reads before writes"
✅ **FIXED** - The portfolioService.js now properly structures all reads before writes.

### Firebase not initialized
Make sure `client/src/firebase/config.js` is imported before using any Firebase functions.

### Authentication errors
Check that Email/Password authentication is enabled in Firebase Console.

### Permission denied
Update Firestore security rules to match your use case.

## 🚀 Deployment Checklist

- [ ] Firebase project created (investamon-43293)
- [ ] Firestore database initialized
- [ ] Security rules configured
- [ ] Firebase Authentication enabled
- [ ] Service account key downloaded (for migrations)
- [ ] Firebase SDK installed (`npm install firebase` in client)
- [ ] React app builds successfully (`npm run build`)
- [ ] Data migrated from MongoDB (if applicable)
- [ ] Deployed to Vercel
- [ ] Test buy/sell functionality

## 📞 Support

If you encounter issues:
1. Check Firebase Console for errors
2. Check browser console for client errors
3. Verify Firestore security rules
4. Ensure all environment variables are set

---

**Project:** Investamon Platform
**Firebase Project:** investamon-43293
**Status:** Ready for deployment ✅
