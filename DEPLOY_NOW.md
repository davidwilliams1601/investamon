# 🚀 Deploy InvestiMon v2 - Step by Step

## ✅ Pre-Deployment Checklist

Run these commands in your terminal first:

```bash
# 1. Switch to Node 20
nvm use 20
node -v  # Verify: v20.20.0

# 2. Go to project
cd /Users/dwilliams/Desktop/investimon-v2

# 3. Clean install
rm -rf node_modules package-lock.json
npm install

# 4. Test build
npm run build
# Should complete without errors

# 5. Test locally
npm run dev
# Visit http://localhost:3000
# Register an account to test
```

---

## 🔥 Step 1: Set Up Firebase Project (5 minutes)

### A. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Project name: `investimon-prod` (or your choice)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### B. Enable Authentication

1. In left sidebar: **Build** → **Authentication**
2. Click **"Get started"**
3. Click **"Email/Password"**
4. Toggle **"Enable"**
5. Click **"Save"**

### C. Create Firestore Database

1. In left sidebar: **Build** → **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll add rules later)
4. Select location: **europe-west2 (London)** (closest to UK)
5. Click **"Enable"**

### D. Get Firebase Configuration

1. Click gear icon (⚙️) → **"Project settings"**
2. Scroll to **"Your apps"** section
3. Click web icon **`</>`**
4. App nickname: `InvestiMon Web`
5. Don't check "Firebase Hosting"
6. Click **"Register app"**
7. **Copy the `firebaseConfig` object**

It looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "investimon-prod.firebaseapp.com",
  projectId: "investimon-prod",
  storageBucket: "investimon-prod.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-XXXXXXXXXX"
};
```

### E. Update Your `.env.local`

Edit `/Users/dwilliams/Desktop/investimon-v2/.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...  # Your actual values
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=investimon-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=investimon-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=investimon-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

NEXT_PUBLIC_APP_NAME="InvestiMon"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### F. Test Firebase Connection

```bash
# Restart dev server with new env vars
npm run dev
```

1. Open http://localhost:3000
2. Click **"Start Your Adventure"**
3. Register a test account
4. Check Firebase Console → Authentication
5. You should see your new user! ✅

---

## 🐙 Step 2: Push to GitHub (2 minutes)

### A. Initialize Git Repository

```bash
cd /Users/dwilliams/Desktop/investimon-v2

# Initialize
git init

# Add all files (.gitignore already excludes secrets)
git add .

# First commit
git commit -m "Initial commit - InvestiMon v2 with Next.js 15 + Firebase"

# Create main branch
git branch -M main
```

### B. Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `investimon-v2`
3. Choose: **Private** (recommended initially)
4. Don't initialize with README (we have one)
5. Click **"Create repository"**

### C. Push to GitHub

Copy the commands GitHub shows you, or use these:

```bash
# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/investimon-v2.git

# Push
git push -u origin main
```

You might need to authenticate with GitHub. Use:
- GitHub CLI: `gh auth login`
- Or: Personal Access Token
- Or: SSH key

---

## ▲ Step 3: Deploy to Vercel (3 minutes)

### A. Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in (you already have an account)
3. Click **"Add New..."** → **"Project"**
4. If not connected: Click **"Continue with GitHub"**
5. Find and **import** `investimon-v2` repository

### B. Configure Project

Vercel will auto-detect Next.js settings. Leave defaults:
- **Framework Preset:** Next.js
- **Root Directory:** ./
- **Build Command:** `npm run build`
- **Output Directory:** .next

### C. Add Environment Variables

**CRITICAL STEP!** Click **"Environment Variables"**

Add these (copy from your `.env.local`):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=investimon-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=investimon-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=investimon-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_APP_NAME=InvestiMon
```

For each variable:
- Click **"Add Another"**
- Enter name and value
- Select **all environments**: Production, Preview, Development

### D. Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes (watch the build logs)
3. You'll see **"Congratulations!"** 🎉
4. Click **"Visit"** to see your live site!

Your URL will be like: `investimon-v2.vercel.app`

---

## 🔐 Step 4: Update Firebase for Production (1 minute)

Your Vercel app needs permission to use Firebase:

### Add Authorized Domain

1. Firebase Console → **Authentication**
2. Click **"Settings"** tab
3. Scroll to **"Authorized domains"**
4. Click **"Add domain"**
5. Enter: `investimon-v2.vercel.app` (or your Vercel URL)
6. Click **"Add"**

---

## ✅ Step 5: Test Your Live App!

1. Open your Vercel URL: `investimon-v2.vercel.app`
2. Click **"Start Your Adventure"**
3. Register a new account
4. Check Firebase Console → Authentication
5. See your user in the database! ✅

### Test Everything:

- [ ] Landing page loads
- [ ] Registration works
- [ ] Firebase creates user
- [ ] Login works
- [ ] Dashboard displays
- [ ] Can sign out
- [ ] Works on mobile

---

## 🎯 You're Live!

**Congratulations!** Your app is now:
- ✅ Live on the internet
- ✅ Secure HTTPS
- ✅ Global CDN
- ✅ Automatic deployments
- ✅ Firebase authentication working

---

## 🔄 From Now On: Auto-Deploy

Every time you push to GitHub, Vercel automatically deploys:

```bash
# Make changes
git add .
git commit -m "Add character listing"
git push

# Vercel deploys automatically! ✨
# You get email: "Deployment ready"
```

---

## 🛡️ Step 6: Add Production Security Rules

**Important:** Your Firestore is in test mode (anyone can read/write)

### Apply Security Rules

1. Firebase Console → **Firestore Database**
2. Click **"Rules"** tab
3. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    function isParentOf(userId) {
      return get(/databases/$(database)/documents/users/$(userId))
        .data.parentId == request.auth.uid;
    }

    // Users
    match /users/{userId} {
      allow read: if isAuthenticated() && (isOwner(userId) || isParentOf(userId));
      allow create: if isAuthenticated() && isOwner(userId);
      allow update: if isAuthenticated() && isOwner(userId);
      allow delete: if false;
    }

    // Characters (read-only)
    match /characters/{characterId} {
      allow read: if isAuthenticated();
      allow write: if false;
    }

    // Portfolios
    match /portfolios/{userId} {
      allow read: if isAuthenticated() && (isOwner(userId) || isParentOf(userId));
      allow write: if isAuthenticated() && isOwner(userId);
    }

    // Challenges (read-only)
    match /challenges/{challengeId} {
      allow read: if isAuthenticated();
      allow write: if false;
    }

    // User Challenges
    match /userChallenges/{userId} {
      allow read: if isAuthenticated() && (isOwner(userId) || isParentOf(userId));
      allow write: if isAuthenticated() && isOwner(userId);
    }

    // Transactions (read-only for users)
    match /transactions/{transactionId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow write: if false;
    }
  }
}
```

4. Click **"Publish"**

---

## 🎨 Optional: Custom Domain

Want `investimon.com` instead of `investimon-v2.vercel.app`?

### Add Custom Domain

1. Buy domain (Namecheap, GoDaddy, etc.) ~$10-15/year
2. Vercel Dashboard → Your project → **Settings** → **Domains**
3. Click **"Add"**
4. Enter your domain
5. Follow DNS instructions
6. Vercel provides free SSL automatically

Then update Firebase authorized domains with your custom domain.

---

## 🎊 You Did It!

Your production deployment is complete! 🎉

**What you have:**
- ✅ Live website
- ✅ Automatic deployments
- ✅ Firebase authentication
- ✅ Secure database
- ✅ Global CDN
- ✅ Free SSL/HTTPS

**Next steps:**
1. Build more features (characters, portfolio, challenges)
2. Push to GitHub
3. Automatic deployment!

**Your workflow:**
```bash
git add .
git commit -m "New feature"
git push
# Live in 2 minutes! ✨
```

---

## 📊 Monitor Your App

- **Vercel Dashboard:** Real-time traffic, deployments
- **Firebase Console:** Users, database, analytics
- **GitHub:** Code, issues, PRs

---

## 🆘 Troubleshooting

### Build fails on Vercel?
- Check deployment logs
- Verify environment variables
- Test locally: `npm run build`

### Can't login on production?
- Add Vercel domain to Firebase authorized domains
- Check environment variables in Vercel

### Changes not showing?
- Hard refresh: Cmd+Shift+R (Mac)
- Check deployment status
- Wait 1-2 minutes for CDN cache

---

**🎉 Congratulations! You're live on the internet!**

Share your URL: `investimon-v2.vercel.app`
