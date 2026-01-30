# 🚀 InvestiMon v2 - Setup Guide

Welcome to InvestiMon v2! This is a complete rebuild with Next.js 15, TypeScript, Firebase, and modern best practices.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Firebase Setup](#firebase-setup)
3. [Local Development Setup](#local-development-setup)
4. [Project Structure](#project-structure)
5. [Running the Application](#running-the-application)
6. [Next Steps](#next-steps)

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js 20+** (Required for Next.js 16 - you currently have Node 18)
  - Update Node: `nvm install 20` or download from https://nodejs.org/
- **npm** or **yarn**
- **Firebase account** (free tier is sufficient)
- **Git** (optional, for version control)

---

## Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it "InvestiMon" or similar
4. Disable Google Analytics (optional)
5. Click "Create Project"

### Step 2: Enable Authentication

1. In Firebase Console, go to **Build** > **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** provider
4. Click **Save**

### Step 3: Create Firestore Database

1. Go to **Build** > **Firestore Database**
2. Click **Create Database**
3. Choose **Start in test mode** (we'll add security rules later)
4. Select your preferred location
5. Click **Enable**

### Step 4: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web** icon `</>`
4. Register your app with nickname "InvestiMon Web"
5. Copy the `firebaseConfig` object

### Step 5: Configure Environment Variables

1. Open the file `.env.local` in the project root
2. Replace the placeholder values with your Firebase config:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## Local Development Setup

### Step 1: Upgrade Node.js (IMPORTANT!)

```bash
# Using nvm (recommended)
nvm install 20
nvm use 20

# Or download from https://nodejs.org/ and install manually
```

### Step 2: Install Dependencies

```bash
cd investimon-v2
npm install
```

### Step 3: Verify Configuration

Check that `.env.local` has your Firebase credentials.

---

## Project Structure

```
investimon-v2/
├── app/                      # Next.js 15 App Router
│   ├── auth/                 # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/            # Main dashboard (TODO)
│   ├── characters/           # Character collection (TODO)
│   ├── portfolio/            # Portfolio management (TODO)
│   ├── challenges/           # Challenges page (TODO)
│   ├── parent/               # Parent dashboard (TODO)
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Landing page
│   └── providers.tsx         # React Query provider
├── components/               # Reusable UI components
│   ├── ui/                   # Base UI components (TODO)
│   ├── auth/                 # Auth-related components
│   ├── characters/           # Character cards, etc.
│   ├── challenges/           # Challenge components
│   ├── portfolio/            # Portfolio components
│   └── layout/               # Navigation, Header, Footer
├── hooks/                    # Custom React hooks
│   └── useAuth.tsx           # Authentication hook ✅
├── lib/                      # Utility libraries
│   ├── firebase/
│   │   ├── config.ts         # Firebase initialization ✅
│   │   ├── auth.ts           # Auth functions ✅
│   │   └── firestore.ts      # Database operations ✅
│   └── utils/                # Helper functions (TODO)
├── types/                    # TypeScript type definitions
│   └── index.ts              # All TypeScript interfaces ✅
├── .env.local                # Environment variables ✅
├── .env.local.example        # Example env file ✅
└── README_SETUP.md           # This file
```

✅ = Implemented
TODO = Next steps

---

## Running the Application

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### What You'll See

1. **Landing Page** - Beautiful hero section with features
2. **Register Page** - `/auth/register` - Create parent or child account
3. **Login Page** - `/auth/login` - Sign in to existing account

### Test the Auth Flow

1. Go to `/auth/register`
2. Create a child account (age 7-14) or parent account
3. Check Firebase Console > Authentication - you should see the new user
4. Check Firestore > users collection - user document should exist
5. You'll be redirected to `/dashboard` (currently blank)

---

## Next Steps

### Phase 2: Core Features (This Week)

#### 1. Dashboard Page
Create `/app/dashboard/page.tsx` with:
- Welcome message
- Balance display
- Experience/Level progress
- Quick stats

#### 2. Character Management
- Seed character data in Firestore
- Create character listing page
- Build character cards
- Implement real-time price updates

#### 3. Portfolio System
- Portfolio display
- Buy/Sell functionality
- Transaction history
- Profit/Loss calculations

### Phase 3: Advanced Features (Next Week)

#### 1. Challenge System
- Seed challenges from old MongoDB
- Challenge cards with age-appropriate content
- Challenge completion logic
- Rewards system

#### 2. Parent Dashboard
- Link parent-child accounts
- View child activity
- Set spending limits
- Approve trades (optional)

#### 3. Real-Time Updates
- Market data updates
- Portfolio value tracking
- Price change notifications

### Phase 4: Polish & Deploy (Week 3-4)

- Security rules for Firestore
- Cloud Functions for scheduled tasks
- Testing (Vitest + Playwright)
- Deploy to Firebase Hosting
- Performance optimization

---

## Seeding Data

### Characters (Companies)

Create a script or manually add to Firestore `characters` collection:

```json
{
  "name": "Apple Buddy",
  "companySymbol": "AAPL",
  "companyName": "Apple Inc.",
  "type": "Technology",
  "description": "A friendly character representing Apple Inc.",
  "imageUrl": "/characters/apple.svg",
  "abilities": ["Innovation", "Brand Power", "Cash Rich"],
  "marketData": {
    "currentPrice": 178.50,
    "priceChange": 2.30,
    "priceChangePercent": 1.3,
    "lastUpdated": "2026-01-30T12:00:00Z"
  },
  "rarity": "epic"
}
```

### Challenges

You already have 20 excellent challenges in your old MongoDB. Copy them to Firestore `challenges` collection.

---

## Firebase Security Rules

### Firestore Rules (After Testing)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read: if request.auth.uid == userId || isParentOf(userId);
      allow write: if request.auth.uid == userId;
    }

    // Characters are read-only for everyone
    match /characters/{characterId} {
      allow read: if true;
      allow write: if false; // Only admin
    }

    // Portfolios
    match /portfolios/{userId} {
      allow read: if request.auth.uid == userId || isParentOf(userId);
      allow write: if request.auth.uid == userId;
    }

    // Challenges are read-only
    match /challenges/{challengeId} {
      allow read: if request.auth != null;
      allow write: if false;
    }

    // User challenges
    match /userChallenges/{userId} {
      allow read: if request.auth.uid == userId || isParentOf(userId);
      allow write: if request.auth.uid == userId;
    }

    function isParentOf(childId) {
      return get(/databases/$(database)/documents/users/$(childId)).data.parentId == request.auth.uid;
    }
  }
}
```

---

## Common Issues & Solutions

### Issue: Node Version Error

**Error**: `Unsupported engine: requires Node >= 20.9.0`

**Solution**: Update to Node 20+
```bash
nvm install 20
nvm use 20
```

### Issue: Firebase Not Initializing

**Error**: `Firebase: Error (auth/invalid-api-key)`

**Solution**: Double-check `.env.local` has correct Firebase credentials

### Issue: Module Not Found

**Error**: `Cannot find module '@/types'`

**Solution**:
```bash
npm install
# or
rm -rf node_modules package-lock.json
npm install
```

### Issue: Hot Reload Not Working

**Solution**: Restart dev server
```bash
# Kill the process
# Then restart
npm run dev
```

---

## Migration from Old Project

### Data Migration Script (TODO)

Create `scripts/migrate-from-mongodb.ts`:
1. Connect to old MongoDB
2. Export users, characters, challenges
3. Transform to Firestore format
4. Import to Firebase

### What to Keep
- ✅ Challenge content (20 challenges)
- ✅ Character definitions (12 characters)
- ✅ Educational content
- ✅ UI/UX concepts

### What to Discard
- ❌ Old authentication code
- ❌ Flask backend files
- ❌ Node proxy servers
- ❌ Mock data fallbacks

---

## Additional Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Firebase Web Documentation](https://firebase.google.com/docs/web/setup)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Query (TanStack Query)](https://tanstack.com/query/latest)

---

## Need Help?

If you encounter issues:

1. Check the [troubleshooting section](#common-issues--solutions)
2. Review Firebase Console for errors
3. Check browser console for client errors
4. Check terminal for server errors

---

## What's Different from Old Project?

| Aspect | Old (Flask + MongoDB) | New (Next.js + Firebase) |
|--------|----------------------|--------------------------|
| **Backend** | Python Flask | Next.js API Routes |
| **Database** | MongoDB Atlas | Firebase Firestore |
| **Auth** | Manual JWT | Firebase Auth |
| **Real-time** | None | Built-in |
| **Deployment** | Multiple services | Single command |
| **TypeScript** | No | Yes ✅ |
| **Security** | Application-level | Database-level rules |
| **Scaling** | Manual | Automatic |

---

## Ready to Continue?

Your foundation is now set up! The authentication system is working, and you're ready to build features.

**Next command to run:**

```bash
npm run dev
```

Then open http://localhost:3000 and register your first account! 🎉
