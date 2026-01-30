import { Timestamp } from 'firebase/firestore';

// User Types
export type UserRole = 'parent' | 'child';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  parentId?: string; // For child accounts
  age?: number;
  balance: number;
  experience: number;
  level: number;
  createdAt: Timestamp;
  settings: UserSettings;
  avatarUrl?: string;
}

export interface UserSettings {
  notifications: boolean;
  spendingLimit?: number; // Parent-set daily limit for children
  allowTrading: boolean;
  theme?: 'light' | 'dark';
  ageGroup?: 'younger' | 'middle' | 'older'; // 7-9, 10-12, 13-14
}

// Character (Company) Types
export interface Character {
  id: string;
  name: string;
  companySymbol: string;
  companyName: string;
  type: string; // e.g., "Technology", "Automotive", "E-Commerce"
  description: string;
  imageUrl: string;
  abilities: string[];
  marketData: MarketData;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface MarketData {
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  lastUpdated: Timestamp;
  marketCap?: number;
  volume?: number;
}

// Portfolio Types
export interface PortfolioItem {
  characterId: string;
  quantity: number;
  averagePurchasePrice: number;
  purchasedAt: Timestamp;
  lastUpdated: Timestamp;
}

export interface Portfolio {
  [characterId: string]: PortfolioItem;
}

// Transaction Types
export type TransactionType = 'buy' | 'sell';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  id: string;
  userId: string;
  characterId: string;
  characterName: string;
  type: TransactionType;
  quantity: number;
  price: number;
  total: number;
  profitLoss?: number; // For sell transactions
  timestamp: Timestamp;
  status: TransactionStatus;
}

// Challenge Types
export type ChallengeType = 'quiz' | 'achievement' | 'timebound' | 'scenario';
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';
export type ChallengeStatus = 'available' | 'in_progress' | 'completed' | 'locked';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  difficulty: ChallengeDifficulty;
  rewards: ChallengeRewards;
  requirements?: ChallengeRequirements;
  ageGroup: string;
  active: boolean;
  createdAt: Timestamp;
  // For quiz challenges
  options?: ChallengeOption[];
  correctAnswer?: string;
  explanation?: string;
  hint?: string;
}

export interface ChallengeOption {
  id: string;
  text: string;
}

export interface ChallengeRewards {
  experience: number;
  cash: number;
  specialItem?: string;
}

export interface ChallengeRequirements {
  minLevel?: number;
  sectorsRequired?: string[];
  holdingPeriodDays?: number;
  portfolioValue?: number;
  dividendIncome?: number;
  profitPercent?: number;
}

export interface UserChallenge {
  challengeId: string;
  status: ChallengeStatus;
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  progress: number; // 0-100
  attempts?: number;
}

// News Types
export interface NewsItem {
  id: string;
  characterId: string;
  characterName: string;
  title: string;
  description: string;
  url?: string;
  source: string;
  publishedAt: Timestamp;
  sentiment: 'positive' | 'neutral' | 'negative';
  impact: 'low' | 'medium' | 'high';
  keywords: string[];
  simplifiedExplanation?: string; // Child-friendly version
}

// Parent Dashboard Types
export interface ParentChildLink {
  parentId: string;
  childId: string;
  linkedAt: Timestamp;
  permissions: ChildPermissions;
}

export interface ChildPermissions {
  canTrade: boolean;
  dailySpendingLimit: number;
  requiresApproval: boolean;
  allowedCharacterTypes?: string[];
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  role: UserRole;
  age?: number;
  parentEmail?: string; // For child registration
}

export interface TradeForm {
  characterId: string;
  quantity: number;
  action: 'buy' | 'sell';
}
