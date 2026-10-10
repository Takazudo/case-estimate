import { getScope, signal } from '@takazudo/zfb/zudo-react';

const isValidHexColor = (color: string): boolean => /^#[0-9A-Fa-f]{6}$/.test(color);

const getStoredColor = (key: string, defaultValue: string): string => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    if (stored && isValidHexColor(stored)) return stored;
  } catch (error) {
    console.warn(`Failed to read ${key} from localStorage:`, error);
  }
  return defaultValue;
};

const saveColorToStorage = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  try {
    if (isValidHexColor(value)) localStorage.setItem(key, value);
    else console.warn(`Invalid color value for ${key}:`, value);
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
};

export function useLocalStorageColor(key: string, defaultValue: string) {
  const scope = getScope();
  const color = signal(defaultValue);
  let initialized = false;
  scope.onActivate(() => {
    color.value = getStoredColor(key, defaultValue);
    initialized = true;
  });
  scope.effect(() => {
    const value = color.value;
    if (initialized) saveColorToStorage(key, value);
  });
  const setColor = (value: string) => {
    color.value = value;
  };
  return [color, setColor] as const;
}
