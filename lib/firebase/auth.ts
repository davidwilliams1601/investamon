import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { User, UserRole } from '@/types';

/**
 * Register a new user
 */
export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: UserRole,
  age?: number,
  parentEmail?: string
): Promise<User> {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Update display name
    await updateProfile(firebaseUser, { displayName: name });

    // Determine parent ID if child account
    let parentId: string | undefined;
    if (role === 'child' && parentEmail) {
      // Find parent by email - in real app, implement parent invite system
      // For now, we'll leave it undefined and handle linking separately
      parentId = undefined;
    }

    // Create user document in Firestore
    const userData: Omit<User, 'id'> = {
      email,
      name,
      role,
      age,
      parentId,
      balance: 10000, // Starting balance
      experience: 0,
      level: 1,
      createdAt: serverTimestamp() as any,
      settings: {
        notifications: true,
        allowTrading: true,
        spendingLimit: role === 'child' ? 1000 : undefined,
        ageGroup: age ? getAgeGroup(age) : 'middle',
      },
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), userData);

    // Return user data
    return {
      id: firebaseUser.uid,
      ...userData,
    } as User;
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(error.message || 'Failed to register user');
  }
}

/**
 * Sign in existing user
 */
export async function signIn(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    return {
      id: firebaseUser.uid,
      ...userDoc.data(),
    } as User;
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(error.message || 'Failed to send password reset email');
  }
}

/**
 * Get user data by ID
 */
export async function getUserData(userId: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));

    if (!userDoc.exists()) {
      return null;
    }

    return {
      id: userId,
      ...userDoc.data(),
    } as User;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

/**
 * Helper function to determine age group
 */
function getAgeGroup(age: number): 'younger' | 'middle' | 'older' {
  if (age <= 9) return 'younger';
  if (age <= 12) return 'middle';
  return 'older';
}
