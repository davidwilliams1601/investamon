# 🚀 InvestiMon v2 - Deployment Guide

## Perfect! GitHub + Vercel is the Best Choice

You're already familiar with GitHub and Vercel, which is actually **better** than Firebase Hosting for Next.js!

---

## 📋 Your Deployment Stack

```
┌──────────────────────────────────┐
│  GitHub (Version Control)        │
│           ↓                      │
│  Vercel (Next.js Hosting)        │
│           ↓                      │
│  Firebase (Auth + Database)      │
└──────────────────────────────────┘
```

**Why this is optimal:**
- ✅ Vercel made by Next.js creators (perfect optimization)
- ✅ Automatic deployments on push
- ✅ Preview URLs for every PR
- ✅ Global edge network (faster than Firebase Hosting)
- ✅ Zero configuration needed
- ✅ Firebase handles backend perfectly

---

## 🚀 Deployment Steps

### Step 1: Push to GitHub (2 minutes)

```bash
cd /Users/dwilliams/Desktop/investimon-v2

# Initialize git
git init

# Add all files (.gitignore already excludes secrets)
git add .

# First commit
git commit -m "Initial commit - InvestiMon v2"

# Create main branch
git branch -M main

# Add your GitHub repo
git remote add origin https://github.com/YOUR_USERNAME/investimon-v2.git

# Push
git push -u origin main
```

### Step 2: Deploy to Vercel (3 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import `investimon-v2` repository
5. Vercel auto-detects Next.js settings ✅

### Step 3: Add Environment Variables

**In Vercel Dashboard:**
- Settings → Environment Variables
- Add these (from your `.env.local`):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Select environments:** Production, Preview, Development

### Step 4: Deploy

Click "Deploy" → Wait 2-3 minutes → Done! 🎉

Your app will be live at: `investimon-v2.vercel.app`

---

## 🔐 Update Firebase Settings

Your app now has a new URL. Update Firebase:

1. **Firebase Console** → Your Project
2. **Authentication** → Settings → **Authorized domains**
3. Add: `investimon-v2.vercel.app`
4. (Add custom domain later if you set one up)

---

## 🔄 Continuous Deployment (Automatic!)

From now on, every push to GitHub automatically deploys:

```bash
# Make changes
git add .
git commit -m "Add character listing page"
git push

# Vercel automatically deploys! ✨
# You'll get notification when deployment completes
```

### Preview Deployments

**Pull Request = Automatic Preview:**
1. Create branch: `git checkout -b feature/new-page`
2. Push: `git push origin feature/new-page`
3. Create PR on GitHub
4. Vercel comments with preview URL!
5. Test on preview before merging
6. Merge → Auto-deploys to production

---

## 📊 What You Get Free

**Vercel Hobby (FREE):**
- ✅ Unlimited projects
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS/SSL
- ✅ Global CDN
- ✅ Preview deployments
- ✅ Analytics

**Firebase Spark (FREE):**
- ✅ 50K database reads/day
- ✅ 20K database writes/day
- ✅ 1GB storage
- ✅ Unlimited auth

**This handles 100-500 active users easily!**

---

## 🌐 Custom Domain (Optional)

Want your own domain like `investimon.com`?

1. Buy domain (Namecheap, GoDaddy, etc.)
2. Vercel Dashboard → Settings → Domains
3. Add your domain
4. Follow DNS instructions
5. Vercel provides free SSL automatically

**Cost:** ~$10-15/year for domain

---

## 🔒 Production Security Checklist

Before going live, add these Firebase Security Rules:

**Firestore Rules:**
1. Firebase Console → Firestore Database → Rules
2. Replace with:

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

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated() &&
                     (isOwner(userId) || isParentOf(userId));
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
      allow read: if isAuthenticated() &&
                     (isOwner(userId) || isParentOf(userId));
      allow write: if isAuthenticated() && isOwner(userId);
    }

    // Challenges (read-only)
    match /challenges/{challengeId} {
      allow read: if isAuthenticated();
      allow write: if false;
    }

    // User Challenges
    match /userChallenges/{userId} {
      allow read: if isAuthenticated() &&
                     (isOwner(userId) || isParentOf(userId));
      allow write: if isAuthenticated() && isOwner(userId);
    }
  }
}
```

3. Click "Publish"

---

## 📈 Monitoring

### Vercel Analytics (Built-in)

- Dashboard → Analytics
- Real-time visitors
- Page performance
- Geographic distribution

### Firebase Analytics

- Firebase Console → Analytics
- User behavior
- Event tracking
- Retention metrics

---

## 🐛 Troubleshooting

### Build Fails on Vercel

**Check:**
1. Vercel Dashboard → Deployments → Failed build
2. View logs for errors
3. Fix locally, test with `npm run build`
4. Push fix

### Firebase Auth Error

**Error:** `auth/unauthorized-domain`

**Fix:** Add Vercel domain to Firebase authorized domains

### Environment Variables Not Working

**After adding env vars, you must:**
- Trigger new deployment (push to GitHub)
- Or: Redeploy from Vercel dashboard

---

## 💻 Development Workflow

### Daily Workflow

```bash
# 1. Pull latest
git pull origin main

# 2. Create feature branch
git checkout -b feature/portfolio-page

# 3. Develop locally
npm run dev

# 4. Commit and push
git add .
git commit -m "Add portfolio page with real-time updates"
git push origin feature/portfolio-page

# 5. Open PR on GitHub
# → Vercel creates preview deployment automatically

# 6. Review, test, merge
# → Automatically deploys to production!
```

### Rollback (if needed)

1. Vercel Dashboard → Deployments
2. Find previous working version
3. Click "..." → "Promote to Production"
4. Instant rollback!

---

## 📦 Deployment Checklist

Before first deployment:

- [x] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added to Vercel
- [ ] Firebase authorized domains updated
- [ ] Firestore security rules applied
- [ ] Test registration on production
- [ ] Test login on production
- [ ] Test on mobile device

---

## 💰 Pricing Estimates

**Your setup (first 1000 users):**
- GitHub: FREE ✅
- Vercel: FREE ✅
- Firebase: FREE ✅

**At 5,000+ users:**
- GitHub: FREE ✅
- Vercel: FREE or $20/month (Pro) for team features
- Firebase: ~$25-50/month (Blaze Plan, pay-as-you-go)

**Still very affordable!**

---

## 🎯 Summary

Your deployment strategy is:

✅ **Professional** - Industry standard stack
✅ **Automated** - Push to deploy
✅ **Fast** - Global edge network
✅ **Secure** - Firebase security rules
✅ **Scalable** - Handles growth automatically
✅ **Free** - For initial users
✅ **Familiar** - You already know GitHub + Vercel!

---

## 🚀 Ready to Deploy?

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/investimon-v2.git
git push -u origin main

# 2. Go to vercel.com
# 3. Import repository
# 4. Add environment variables
# 5. Deploy!

# You'll be live in 5 minutes! 🎉
```

---

## 📞 Quick Commands

```bash
# Check deployment status
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Install Vercel CLI (optional)
npm install -g vercel
```

---

**You're all set!** Your familiar GitHub + Vercel workflow works perfectly with Firebase backend. Best of both worlds! 🌟
