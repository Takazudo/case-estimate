import { useState, useEffect } from 'react';

// Helper function to validate hex color format
const isValidHexColor = (color: string): boolean => {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
};

// Helper function to safely get color from localStorage with validation
const getStoredColor = (key: string, defaultValue: string): string => {
  try {
    const stored = localStorage.getItem(key);
    if (stored && isValidHexColor(stored)) {
      return stored;
    }
  } catch (error) {
    // localStorage might be unavailable or throw errors
    console.warn(`Failed to read ${key} from localStorage:`, error);
  }
  return defaultValue;
};

// Helper function to safely save color to localStorage
const saveColorToStorage = (key: string, value: string): void => {
  try {
    if (isValidHexColor(value)) {
      localStorage.setItem(key, value);
    } else {
      console.warn(`Invalid color value for ${key}:`, value);
    }
  } catch (error) {
    // localStorage might be unavailable or throw errors (e.g., in private browsing)
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
};

export function useLocalStorageColor(key: string, defaultValue: string) {
  const [color, setColor] = useState<string>(() => getStoredColor(key, defaultValue));

  useEffect(() => {
    saveColorToStorage(key, color);
  }, [key, color]);

  return [color, setColor] as const;
}
