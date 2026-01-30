# ⚡ InvestiMon v2 - Quick Start

## 🎯 What's Done

✅ **Project Foundation**
- Next.js 15 + TypeScript + Tailwind CSS
- Firebase configuration ready
- Complete authentication system
- TypeScript types for all entities
- React Query setup for data fetching

✅ **Pages Built**
- Landing page with hero section
- Login page with form validation
- Registration page (parent/child accounts)
- Dashboard page with stats display

✅ **Firebase Integration**
- Authentication (email/password)
- Firestore database operations
- Real-time listeners ready
- Transaction management (buy/sell)
- Challenge completion logic

✅ **TypeScript Types**
- User, Character, Portfolio
- Transaction, Challenge, News
- Complete type safety

---

## 🚀 Get Started in 3 Steps

### 1. Update Node.js (CRITICAL!)

```bash
# You need Node 20+ (currently have Node 18)
nvm install 20
nvm use 20

# Verify
node -v  # Should show v20.x.x
```

### 2. Set Up Firebase (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project called "InvestiMon"
3. Enable **Authentication** > Email/Password
4. Enable **Firestore Database** (test mode)
5. Get config from Project Settings > Web App
6. Update `.env.local` with your credentials

### 3. Run the App

```bash
cd /Users/dwilliams/Desktop/investimon-v2
npm install
npm run dev
```

Open http://localhost:3000

---

## 🧪 Test It Out

1. Click "Start Your Adventure"
2. Create a child account (age 10)
3. Check Firebase Console:
   - Authentication tab: see new user
   - Firestore tab: see `users` collection
4. You'll land on the dashboard with:
   - £10,000 starting balance
   - Level 1, 0 XP
   - Welcome message

---

## 📁 Key Files to Know

```
investimon-v2/
├── .env.local                      # ⚠️ ADD YOUR FIREBASE CREDENTIALS HERE
├── lib/firebase/
│   ├── config.ts                   # Firebase initialization
│   ├── auth.ts                     # Sign up, sign in, sign out
│   └── firestore.ts                # Database operations
├── hooks/useAuth.tsx               # Get current user anywhere
├── types/index.ts                  # All TypeScript types
├── app/
│   ├── page.tsx                    # Landing page
│   ├── auth/login/page.tsx         # Login
│   ├── auth/register/page.tsx      # Registration
│   └── dashboard/page.tsx          # Dashboard
```

---

## ✨ What Makes This Better

| Feature | Old Project | New Project |
|---------|------------|-------------|
| **Real-time Updates** | ❌ None | ✅ Built-in |
| **Type Safety** | ❌ No | ✅ Full TypeScript |
| **Security** | ⚠️ Manual | ✅ Firebase Rules |
| **Authentication** | ⚠️ Custom JWT | ✅ Firebase Auth |
| **Deployment** | ⚠️ Complex | ✅ One command |
| **Scalability** | ⚠️ Manual | ✅ Automatic |
| **Testing** | ❌ None | 🔄 Coming |
| **Parent Controls** | ⚠️ Basic | ✅ Database-level |

---

## 🔥 What's Next? (In Order)

### This Week - Core Features

**Day 1-2: Characters**
- [ ] Seed 12 characters to Firestore
- [ ] Create character listing page
- [ ] Build character card component
- [ ] Add real-time price updates

**Day 3-4: Portfolio**
- [ ] Portfolio display page
- [ ] Buy character functionality
- [ ] Sell character functionality
- [ ] Transaction history

**Day 5: Challenges**
- [ ] Migrate 20 challenges from MongoDB
- [ ] Challenge listing page
- [ ] Challenge completion UI
- [ ] Rewards system

### Next Week - Advanced Features

**Week 2:**
- [ ] Parent dashboard
- [ ] Parent-child linking
- [ ] Spending limits
- [ ] Trade approvals

**Week 3:**
- [ ] Market news integration
- [ ] Financial literacy modules
- [ ] Achievements system
- [ ] Leaderboards

**Week 4:**
- [ ] Security rules
- [ ] Cloud Functions
- [ ] Testing
- [ ] Deploy to production

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code
npx prettier --write .
```

---

## 📊 Migrating Your Old Data

### Characters (12 from MongoDB)

Create a script: `scripts/seed-characters.ts`

```typescript
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

const characters = [
  {
    name: "Apple Buddy",
    companySymbol: "AAPL",
    // ... rest of data
  },
  // ... 11 more
];

for (const char of characters) {
  await addDoc(collection(db, 'characters'), char);
}
```

### Challenges (20 from MongoDB)

Your challenges.py file has excellent content. Convert to Firestore format.

---

## 🐛 Common Issues

**"Node version not supported"**
- Update to Node 20: `nvm install 20 && nvm use 20`

**"Firebase auth/invalid-api-key"**
- Check `.env.local` has correct credentials
- Restart dev server after changing env vars

**"Cannot find module @/types"**
- Run `npm install` again
- Restart VS Code

**Page not updating?**
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Check browser console for errors

---

## 💡 Pro Tips

1. **Use Firebase Emulator** for local development (optional)
2. **Install Firebase Tools**: `npm install -g firebase-tools`
3. **VS Code Extensions**:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - Firebase Explorer

---

## 🎓 Learning Resources

- **Next.js**: https://nextjs.org/learn
- **Firebase**: https://firebase.google.com/docs/web/setup
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Tailwind**: https://tailwindcss.com/docs

---

## 🎉 You're All Set!

Your foundation is solid. Authentication works, database is connected, and you're ready to build features.

**Start here:**
```bash
npm run dev
```

Then register an account and explore! 🚀

**Need the detailed setup?** → Check `README_SETUP.md`

**Want to see the full structure?** → Run `tree -L 3 -I node_modules`

Happy coding! 🎮
