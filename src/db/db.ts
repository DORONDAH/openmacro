import Dexie, { type Table } from 'dexie';

/**
 * OpenMacro Database Schema
 */

export interface WeightEntry {
  id?: number;
  date: string; // ISO format YYYY-MM-DD
  value: number;
}

export interface MealEntry {
  id?: number;
  date: string; // YYYY-MM-DD
  timestamp: number;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  offId?: string; // Open Food Facts ID
}

export interface CustomFood {
  id?: number;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  barcode?: string;
  isIsraeli?: boolean;
}

export interface UserSettings {
  id?: number;
  key: string;
  value: unknown;
}

export class OpenMacroDB extends Dexie {
  weights!: Table<WeightEntry>;
  meals!: Table<MealEntry>;
  customFoods!: Table<CustomFood>;
  settings!: Table<UserSettings>;

  constructor() {
    super('OpenMacroDB');
    this.version(1).stores({
      weights: '++id, date',
      meals: '++id, date, timestamp',
      customFoods: '++id, name, barcode',
      settings: '++id, key',
    });
  }
}

export const db = new OpenMacroDB();
