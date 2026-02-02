# 🚀 Deployment Checklist for Investamon

## ✅ Completed
- [x] Firebase SDK installed in client
- [x] Firestore integration code created
- [x] Transaction fix implemented (reads before writes)
- [x] Code committed to Git
- [x] Code pushed to GitHub (ideasdavid/calculator)
- [x] Setup documentation created

## 🔲 Firebase Console Setup (15 minutes)

### 1. Create Firestore Database
- [ ] Go to https://console.firebase.google.com
- [ ] Select project: **investamon-43293**
- [ ] Click "Firestore Database" in left menu
- [ ] Click "Create database"
- [ ] Choose **Production mode**
- [ ] Select location: **us-central1** (or closest to you)
- [ ] Click "Enable"

### 2. Set Firestore Security Rules
- [ ] In Firestore Database, go to "Rules" tab
- [ ] Replace with these rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /characters/{characterId} {
      allow read: if true;
      allow write: if false;
    }
    match /transactions/{transactionId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if false;
    }
  }
}
```
- [ ] Click "Publish"

### 3. Enable Firebase Authentication
- [ ] Click "Authentication" in left menu
- [ ] Click "Get started"
- [ ] Click "Email/Password"
- [ ] Toggle "Email/Password" to **Enabled**
- [ ] Click "Save"

### 4. Create Initial Test User (Optional)
- [ ] In Authentication → Users tab
- [ ] Click "Add user"
- [ ] Email: `test@investamon.com`
- [ ] Password: `Test123!`
- [ ] Click "Add user"

## 🔲 Vercel Deployment (10 minutes)

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Connect GitHub**
   - [ ] Go to https://vercel.com/new
   - [ ] Click "Add New Project"
   - [ ] Import from GitHub
   - [ ] Select repository: **ideasdavid/calculator**

2. **Configure Project**
   - [ ] Project Name: `investamon` (or your choice)
   - [ ] Framework Preset: **Create React App**
   - [ ] Root Directory: **client**
   - [ ] Build Command: `npm run build` (default)
   - [ ] Output Directory: `build` (default)
   - [ ] Install Command: `npm install` (default)

3. **Environment Variables (Optional)**
   These are already in your code, but you can add them for security:
   - [ ] `REACT_APP_FIREBASE_API_KEY` = `AIzaSyDZ5DrRk1UDimh3Aop-9EseqfFj-KWW7Rk`
   - [ ] `REACT_APP_FIREBASE_AUTH_DOMAIN` = `investamon-43293.firebaseapp.com`
   - [ ] `REACT_APP_FIREBASE_PROJECT_ID` = `investamon-43293`

4. **Deploy**
   - [ ] Click "Deploy"
   - [ ] Wait for build to complete (~2-3 minutes)
   - [ ] Click the generated URL to test

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from client directory
cd "/Users/dwilliams/Desktop/Investing platform/client"
vercel --prod
```

## 🔲 Post-Deployment Testing

### Test on Vercel URL
- [ ] Navigate to your Vercel URL (e.g., `investamon.vercel.app`)
- [ ] Test Registration:
  - [ ] Create new account
  - [ ] Check Firebase Console → Authentication (user appears)
  - [ ] Check Firestore → users collection (document created)
- [ ] Test Login:
  - [ ] Login with created account
  - [ ] Verify dashboard loads
- [ ] Test Portfolio:
  - [ ] Try to buy a stock/character
  - [ ] **Verify no Firestore transaction errors!**
  - [ ] Check Firestore → transactions collection
  - [ ] Verify balance deducted
  - [ ] Try to sell the stock
  - [ ] Verify balance increased

### Check Console Logs
- [ ] Open browser DevTools (F12)
- [ ] Check Console tab for errors
- [ ] Verify Firebase initialized successfully
- [ ] No "reads before writes" errors

## 🔲 Optional: Custom Domain

If you want a custom domain:
- [ ] Go to Vercel Project → Settings → Domains
- [ ] Add your domain (e.g., `investamon.com`)
- [ ] Update DNS records as instructed
- [ ] Wait for DNS propagation (~24 hours)

## 🔲 Optional: Migrate Existing Data

If you have MongoDB data to migrate:

1. **Download Service Account Key**
   - [ ] Firebase Console → Project Settings → Service Accounts
   - [ ] Click "Generate new private key"
   - [ ] Save as `serviceAccountKey.json` in project root

2. **Run Migration**
   ```bash
   cd "/Users/dwilliams/Desktop/Investing platform"
   source .venv/bin/activate
   python migrate_to_firestore.py
   ```

3. **Verify Migration**
   - [ ] Check Firestore Console
   - [ ] Verify users collection populated
   - [ ] Verify characters collection populated
   - [ ] Verify transactions collection populated

## 📊 Monitoring & Maintenance

### Firebase Console Monitoring
- [ ] Set up Firebase Analytics (optional)
- [ ] Monitor Firestore usage: Firestore → Usage tab
- [ ] Check Authentication users: Authentication → Users tab
- [ ] Review security rules: Firestore → Rules tab

### Vercel Monitoring
- [ ] Check deployment logs: Vercel Dashboard → Project → Deployments
- [ ] Monitor analytics: Vercel Dashboard → Analytics
- [ ] Set up alerts: Settings → Alerts

## 🆘 Troubleshooting

### Common Issues

**Build fails on Vercel:**
- Check Vercel build logs
- Ensure `client/package.json` has all dependencies
- Verify Node version compatibility

**Firebase initialization errors:**
- Check Firebase config in `client/src/firebase/config.js`
- Verify API key is correct
- Check browser console for specific error

**Authentication not working:**
- Verify Email/Password is enabled in Firebase Console
- Check Firestore security rules allow user reads/writes
- Clear browser cache and cookies

**"Reads before writes" error:**
- This should be FIXED in the new code
- If it still appears, check `portfolioService.js` line order
- Ensure all `transaction.get()` calls are before `transaction.update()`

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Site loads on Vercel URL
- ✅ Can create new user account
- ✅ Can login with created account
- ✅ Can buy stocks without errors
- ✅ Can sell stocks without errors
- ✅ Balance updates correctly
- ✅ No console errors
- ✅ Firestore data appears in Firebase Console

---

## 📞 Need Help?

If you encounter issues:
1. Check browser console (F12)
2. Check Vercel build logs
3. Check Firebase Console for errors
4. Review FIRESTORE_SETUP.md for detailed instructions

---

**Current Status:** Ready for Firebase Console setup and Vercel deployment
**Estimated Time:** 25 minutes total
**Project:** investamon-43293
**GitHub:** ideasdavid/calculator
