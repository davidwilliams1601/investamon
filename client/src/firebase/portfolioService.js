import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  runTransaction,
  collection,
  addDoc,
  Timestamp
} from 'firebase/firestore';
import db from './config';

/**
 * Buy stock/character - with proper transaction handling
 * ALL READS MUST HAPPEN BEFORE WRITES
 */
export const buyStock = async (userId, characterId, quantity) => {
  try {
    // Run Firestore transaction with reads before writes
    const result = await runTransaction(db, async (transaction) => {
      // ===== PHASE 1: ALL READS FIRST =====
      const userRef = doc(db, 'users', userId);
      const characterRef = doc(db, 'characters', characterId);

      const userDoc = await transaction.get(userRef);
      const characterDoc = await transaction.get(characterRef);

      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      if (!characterDoc.exists()) {
        throw new Error('Character not found');
      }

      const userData = userDoc.data();
      const characterData = characterDoc.data();

      // Calculate transaction details
      const price = characterData.marketData?.currentPrice || 0;
      const totalCost = price * quantity;
      const userBalance = userData.balance || 0;

      if (userBalance < totalCost) {
        throw new Error(`Insufficient funds. Need $${totalCost.toFixed(2)}, have $${userBalance.toFixed(2)}`);
      }

      // Get portfolio data
      const portfolio = userData.portfolio || [];
      const existingItem = portfolio.find(item => item.characterId === characterId);

      // Calculate new values
      let newPortfolio;
      if (existingItem) {
        // Update existing position
        const newQuantity = existingItem.quantity + quantity;
        const newAvgPrice = ((existingItem.averagePurchasePrice * existingItem.quantity) + (price * quantity)) / newQuantity;

        newPortfolio = portfolio.map(item =>
          item.characterId === characterId
            ? { ...item, quantity: newQuantity, averagePurchasePrice: newAvgPrice }
            : item
        );
      } else {
        // Add new position
        newPortfolio = [...portfolio, {
          characterId,
          characterName: characterData.name,
          quantity,
          averagePurchasePrice: price,
          purchasedAt: Timestamp.now()
        }];
      }

      const newBalance = userBalance - totalCost;

      // Calculate experience and level
      const currentExp = userData.experience || 0;
      const tradeExp = Math.min(50, Math.floor(totalCost * 0.01)); // 1% of trade value, max 50 XP
      const newExp = currentExp + tradeExp;
      const currentLevel = userData.level || 1;
      const newLevel = Math.max(currentLevel, Math.floor(newExp / 500) + 1); // 500 XP per level

      // ===== PHASE 2: ALL WRITES =====
      // Update user document with all changes at once
      transaction.update(userRef, {
        portfolio: newPortfolio,
        balance: newBalance,
        experience: newExp,
        level: newLevel
      });

      // Return transaction details
      return {
        success: true,
        message: `Successfully purchased ${quantity} shares of ${characterData.name}`,
        transaction: {
          character: characterData.name,
          quantity,
          price,
          total: totalCost
        },
        newBalance,
        experienceGained: tradeExp,
        levelUp: newLevel > currentLevel,
        newLevel: newLevel > currentLevel ? newLevel : null
      };
    });

    // Record transaction in separate collection (after main transaction completes)
    await addDoc(collection(db, 'transactions'), {
      userId,
      characterId,
      type: 'buy',
      quantity,
      price: result.transaction.price,
      total: result.transaction.total,
      timestamp: Timestamp.now()
    });

    return result;

  } catch (error) {
    console.error('Purchase error:', error);
    throw error;
  }
};

/**
 * Sell stock/character - with proper transaction handling
 * ALL READS MUST HAPPEN BEFORE WRITES
 */
export const sellStock = async (userId, characterId, quantity) => {
  try {
    // Run Firestore transaction with reads before writes
    const result = await runTransaction(db, async (transaction) => {
      // ===== PHASE 1: ALL READS FIRST =====
      const userRef = doc(db, 'users', userId);
      const characterRef = doc(db, 'characters', characterId);

      const userDoc = await transaction.get(userRef);
      const characterDoc = await transaction.get(characterRef);

      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      if (!characterDoc.exists()) {
        throw new Error('Character not found');
      }

      const userData = userDoc.data();
      const characterData = characterDoc.data();

      // Get portfolio data
      const portfolio = userData.portfolio || [];
      const existingItem = portfolio.find(item => item.characterId === characterId);

      if (!existingItem) {
        throw new Error("You don't own this character");
      }

      if (existingItem.quantity < quantity) {
        throw new Error(`You only own ${existingItem.quantity} shares of this character`);
      }

      // Calculate transaction details
      const price = characterData.marketData?.currentPrice || 0;
      const totalValue = price * quantity;
      const profitLoss = (price - existingItem.averagePurchasePrice) * quantity;

      // Calculate new values
      const newQuantity = existingItem.quantity - quantity;
      let newPortfolio;

      if (newQuantity === 0) {
        // Remove position entirely
        newPortfolio = portfolio.filter(item => item.characterId !== characterId);
      } else {
        // Update quantity
        newPortfolio = portfolio.map(item =>
          item.characterId === characterId
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      const userBalance = userData.balance || 0;
      const newBalance = userBalance + totalValue;

      // Calculate experience and level
      const currentExp = userData.experience || 0;
      const tradeExp = Math.min(50, Math.floor(totalValue * 0.01)); // 1% of trade value, max 50 XP
      const newExp = currentExp + tradeExp;
      const currentLevel = userData.level || 1;
      const newLevel = Math.max(currentLevel, Math.floor(newExp / 500) + 1); // 500 XP per level

      // ===== PHASE 2: ALL WRITES =====
      // Update user document with all changes at once
      transaction.update(userRef, {
        portfolio: newPortfolio,
        balance: newBalance,
        experience: newExp,
        level: newLevel
      });

      // Return transaction details
      return {
        success: true,
        message: `Successfully sold ${quantity} shares of ${characterData.name}`,
        transaction: {
          character: characterData.name,
          quantity,
          price,
          total: totalValue,
          profitLoss
        },
        newBalance,
        experienceGained: tradeExp,
        levelUp: newLevel > currentLevel,
        newLevel: newLevel > currentLevel ? newLevel : null
      };
    });

    // Record transaction in separate collection (after main transaction completes)
    await addDoc(collection(db, 'transactions'), {
      userId,
      characterId,
      type: 'sell',
      quantity,
      price: result.transaction.price,
      total: result.transaction.total,
      profitLoss: result.transaction.profitLoss,
      timestamp: Timestamp.now()
    });

    return result;

  } catch (error) {
    console.error('Sale error:', error);
    throw error;
  }
};

/**
 * Get user's portfolio
 */
export const getPortfolio = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    return userData.portfolio || [];

  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;
  }
};

/**
 * Get user's transaction history
 */
export const getTransactions = async (userId) => {
  try {
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, where('userId', '==', userId), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};
