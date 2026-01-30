import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Query,
  DocumentData,
  serverTimestamp,
  runTransaction,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import {
  User,
  Character,
  Portfolio,
  PortfolioItem,
  Transaction,
  Challenge,
  UserChallenge,
  NewsItem,
} from '@/types';

// ============================================================================
// CHARACTER OPERATIONS
// ============================================================================

/**
 * Get all characters
 */
export async function getAllCharacters(): Promise<Character[]> {
  const charactersRef = collection(db, 'characters');
  const snapshot = await getDocs(charactersRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Character[];
}

/**
 * Get character by ID
 */
export async function getCharacter(characterId: string): Promise<Character | null> {
  const docRef = doc(db, 'characters', characterId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Character;
}

/**
 * Subscribe to character updates (real-time)
 */
export function subscribeToCharacter(
  characterId: string,
  callback: (character: Character) => void
): Unsubscribe {
  const docRef = doc(db, 'characters', characterId);

  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback({
        id: doc.id,
        ...doc.data(),
      } as Character);
    }
  });
}

// ============================================================================
// PORTFOLIO OPERATIONS
// ============================================================================

/**
 * Get user's portfolio
 */
export async function getUserPortfolio(userId: string): Promise<Portfolio> {
  const docRef = doc(db, 'portfolios', userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return {};
  }

  return docSnap.data() as Portfolio;
}

/**
 * Subscribe to portfolio updates (real-time)
 */
export function subscribeToPortfolio(
  userId: string,
  callback: (portfolio: Portfolio) => void
): Unsubscribe {
  const docRef = doc(db, 'portfolios', userId);

  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as Portfolio);
    } else {
      callback({});
    }
  });
}

/**
 * Buy character (add to portfolio)
 */
export async function buyCharacter(
  userId: string,
  characterId: string,
  quantity: number
): Promise<void> {
  await runTransaction(db, async (transaction) => {
    // Get user data
    const userRef = doc(db, 'users', userId);
    const userDoc = await transaction.get(userRef);

    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const user = userDoc.data() as User;

    // Get character data
    const characterRef = doc(db, 'characters', characterId);
    const characterDoc = await transaction.get(characterRef);

    if (!characterDoc.exists()) {
      throw new Error('Character not found');
    }

    const character = characterDoc.data() as Character;

    // Calculate cost
    const cost = character.marketData.currentPrice * quantity;

    // Check if user has enough balance
    if (user.balance < cost) {
      throw new Error('Insufficient funds');
    }

    // Update user balance
    transaction.update(userRef, {
      balance: user.balance - cost,
      experience: user.experience + Math.floor(cost * 0.01), // 1% of trade value as XP
    });

    // Update portfolio
    const portfolioRef = doc(db, 'portfolios', userId);
    const portfolioDoc = await transaction.get(portfolioRef);
    const portfolio = portfolioDoc.exists() ? (portfolioDoc.data() as Portfolio) : {};

    const existingItem = portfolio[characterId];

    if (existingItem) {
      // Update existing position
      const newQuantity = existingItem.quantity + quantity;
      const newAvgPrice =
        (existingItem.averagePurchasePrice * existingItem.quantity +
          character.marketData.currentPrice * quantity) /
        newQuantity;

      portfolio[characterId] = {
        characterId,
        quantity: newQuantity,
        averagePurchasePrice: newAvgPrice,
        purchasedAt: existingItem.purchasedAt,
        lastUpdated: serverTimestamp() as any,
      };
    } else {
      // Create new position
      portfolio[characterId] = {
        characterId,
        quantity,
        averagePurchasePrice: character.marketData.currentPrice,
        purchasedAt: serverTimestamp() as any,
        lastUpdated: serverTimestamp() as any,
      };
    }

    transaction.set(portfolioRef, portfolio);

    // Create transaction record
    const transactionRef = doc(collection(db, 'transactions'));
    transaction.set(transactionRef, {
      userId,
      characterId,
      characterName: character.name,
      type: 'buy',
      quantity,
      price: character.marketData.currentPrice,
      total: cost,
      timestamp: serverTimestamp(),
      status: 'completed',
    });
  });
}

/**
 * Sell character (remove from portfolio)
 */
export async function sellCharacter(
  userId: string,
  characterId: string,
  quantity: number
): Promise<void> {
  await runTransaction(db, async (transaction) => {
    // Get user data
    const userRef = doc(db, 'users', userId);
    const userDoc = await transaction.get(userRef);

    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const user = userDoc.data() as User;

    // Get character data
    const characterRef = doc(db, 'characters', characterId);
    const characterDoc = await transaction.get(characterRef);

    if (!characterDoc.exists()) {
      throw new Error('Character not found');
    }

    const character = characterDoc.data() as Character;

    // Get portfolio
    const portfolioRef = doc(db, 'portfolios', userId);
    const portfolioDoc = await transaction.get(portfolioRef);

    if (!portfolioDoc.exists()) {
      throw new Error('Portfolio not found');
    }

    const portfolio = portfolioDoc.data() as Portfolio;
    const existingItem = portfolio[characterId];

    if (!existingItem) {
      throw new Error('You do not own this character');
    }

    if (existingItem.quantity < quantity) {
      throw new Error(`You only own ${existingItem.quantity} of this character`);
    }

    // Calculate sale value and profit/loss
    const saleValue = character.marketData.currentPrice * quantity;
    const profitLoss =
      (character.marketData.currentPrice - existingItem.averagePurchasePrice) * quantity;

    // Update user balance
    transaction.update(userRef, {
      balance: user.balance + saleValue,
      experience: user.experience + Math.floor(saleValue * 0.01), // 1% of trade value as XP
    });

    // Update portfolio
    if (existingItem.quantity === quantity) {
      // Remove item completely
      delete portfolio[characterId];
    } else {
      // Reduce quantity
      portfolio[characterId] = {
        ...existingItem,
        quantity: existingItem.quantity - quantity,
        lastUpdated: serverTimestamp() as any,
      };
    }

    transaction.set(portfolioRef, portfolio);

    // Create transaction record
    const transactionRef = doc(collection(db, 'transactions'));
    transaction.set(transactionRef, {
      userId,
      characterId,
      characterName: character.name,
      type: 'sell',
      quantity,
      price: character.marketData.currentPrice,
      total: saleValue,
      profitLoss,
      timestamp: serverTimestamp(),
      status: 'completed',
    });
  });
}

// ============================================================================
// TRANSACTION OPERATIONS
// ============================================================================

/**
 * Get user's transaction history
 */
export async function getUserTransactions(userId: string, limitCount = 50): Promise<Transaction[]> {
  const transactionsRef = collection(db, 'transactions');
  const q = query(
    transactionsRef,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Transaction[];
}

// ============================================================================
// CHALLENGE OPERATIONS
// ============================================================================

/**
 * Get all active challenges
 */
export async function getActiveChallenges(): Promise<Challenge[]> {
  const challengesRef = collection(db, 'challenges');
  const q = query(challengesRef, where('active', '==', true));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Challenge[];
}

/**
 * Get user's challenge progress
 */
export async function getUserChallenges(userId: string): Promise<Record<string, UserChallenge>> {
  const docRef = doc(db, 'userChallenges', userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return {};
  }

  return docSnap.data() as Record<string, UserChallenge>;
}

/**
 * Complete a challenge
 */
export async function completeChallenge(
  userId: string,
  challengeId: string
): Promise<void> {
  await runTransaction(db, async (transaction) => {
    // Get challenge data
    const challengeRef = doc(db, 'challenges', challengeId);
    const challengeDoc = await transaction.get(challengeRef);

    if (!challengeDoc.exists()) {
      throw new Error('Challenge not found');
    }

    const challenge = challengeDoc.data() as Challenge;

    // Get user data
    const userRef = doc(db, 'users', userId);
    const userDoc = await transaction.get(userRef);

    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const user = userDoc.data() as User;

    // Update user with rewards
    transaction.update(userRef, {
      balance: user.balance + challenge.rewards.cash,
      experience: user.experience + challenge.rewards.experience,
    });

    // Update user challenges
    const userChallengesRef = doc(db, 'userChallenges', userId);
    const userChallengesDoc = await transaction.get(userChallengesRef);
    const userChallenges = userChallengesDoc.exists()
      ? (userChallengesDoc.data() as Record<string, UserChallenge>)
      : {};

    userChallenges[challengeId] = {
      challengeId,
      status: 'completed',
      completedAt: serverTimestamp() as any,
      progress: 100,
    };

    transaction.set(userChallengesRef, userChallenges);
  });
}

// ============================================================================
// NEWS OPERATIONS
// ============================================================================

/**
 * Get latest news
 */
export async function getLatestNews(limitCount = 20): Promise<NewsItem[]> {
  const newsRef = collection(db, 'news');
  const q = query(newsRef, orderBy('publishedAt', 'desc'), limit(limitCount));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as NewsItem[];
}
