import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './config';
import { seedCharacters } from './seedCharacters';

/**
 * Upload seed characters to Firestore
 * Run this once to populate the characters collection
 */
export async function uploadSeedCharacters() {
  try {
    console.log('Starting character upload...');

    for (const character of seedCharacters) {
      // Generate ID from company symbol
      const characterId = character.companySymbol.toLowerCase();
      const characterRef = doc(db, 'characters', characterId);

      await setDoc(characterRef, {
        ...character,
        id: characterId,
      });

      console.log(`✓ Uploaded: ${character.name} (${characterId})`);
    }

    console.log(`\n🎉 Successfully uploaded ${seedCharacters.length} characters!`);
    return { success: true, count: seedCharacters.length };
  } catch (error) {
    console.error('Error uploading characters:', error);
    throw error;
  }
}

/**
 * Get all characters from Firestore
 */
export async function getAllCharacters() {
  // This will be implemented in the firestore.ts file
}
