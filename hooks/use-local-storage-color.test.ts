import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorageColor } from './use-local-storage-color';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock console.warn to track warnings
const consoleMock = vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('useLocalStorageColor', () => {
  beforeEach(() => {
    localStorageMock.clear();
    consoleMock.mockClear();
  });

  describe('initialization', () => {
    it('should use default value when localStorage is empty', () => {
      const { result } = renderHook(() => useLocalStorageColor('test-color', '#ffffff'));

      expect(result.current[0]).toBe('#ffffff');
    });

    it('should use stored value when localStorage has valid color', () => {
      localStorageMock.setItem('test-color', '#ff0000');

      const { result } = renderHook(() => useLocalStorageColor('test-color', '#ffffff'));

      expect(result.current[0]).toBe('#ff0000');
    });

    it('should use default value when localStorage has invalid color', () => {
      localStorageMock.setItem('test-color', 'invalid-color');

      const { result } = renderHook(() => useLocalStorageColor('test-color', '#ffffff'));

      expect(result.current[0]).toBe('#ffffff');
    });

    it('should use default value when localStorage throws error', () => {
      // Mock localStorage.getItem to throw
      const originalGetItem = localStorageMock.getItem;
      localStorageMock.getItem = vi.fn(() => {
        throw new Error('localStorage unavailable');
      });

      const { result } = renderHook(() => useLocalStorageColor('test-color', '#ffffff'));

      expect(result.current[0]).toBe('#ffffff');
      expect(consoleMock).toHaveBeenCalledWith(
        expect.stringContaining('Failed to read test-color from localStorage:'),
        expect.any(Error),
      );

      // Restore original method
      localStorageMock.getItem = originalGetItem;
    });
  });

  describe('color validation', () => {
    it('should accept valid 6-digit hex colors', () => {
      const validColors = ['#000000', '#ffffff', '#FF0000', '#00ff00', '#0000FF'];

      validColors.forEach((color) => {
        localStorageMock.setItem('test-color', color);

        const { result } = renderHook(() => useLocalStorageColor('test-color', '#ffffff'));

        expect(result.current[0]).toBe(color);
      });
    });

    it('should reject invalid hex colors', () => {
      const invalidColors = [
        '#fff', // too short
        '#fffffff', // too long
        'ffffff', // missing #
        '#gggggg', // invalid characters
        'red', // named color
        'rgb(255,0,0)', // rgb format
      ];

      invalidColors.forEach((color) => {
        localStorageMock.setItem('test-color', color);

        const { result } = renderHook(() => useLocalStorageColor('test-color', '#ffffff'));

        expect(result.current[0]).toBe('#ffffff'); // Should use default
      });
    });
  });

  describe('color updates', () => {
    it('should update color and save to localStorage', () => {
      const { result } = renderHook(() => useLocalStorageColor('test-color', '#ffffff'));

      act(() => {
        result.current[1]('#ff0000');
      });

      expect(result.current[0]).toBe('#ff0000');
      expect(localStorageMock.getItem('test-color')).toBe('#ff0000');
    });

    it('should not save invalid colors to localStorage but still update state', () => {
      const { result } = renderHook(() => useLocalStorageColor('test-color', '#ffffff'));

      // Clear any existing value first
      localStorageMock.clear();

      act(() => {
        result.current[1]('invalid-color');
      });

      expect(result.current[0]).toBe('invalid-color'); // State is updated
      expect(localStorageMock.getItem('test-color')).toBe(null); // Not saved to localStorage
      expect(consoleMock).toHaveBeenCalledWith(
        'Invalid color value for test-color:',
        'invalid-color',
      );
    });

    it('should handle localStorage errors during save', () => {
      // Mock localStorage.setItem to throw
      const originalSetItem = localStorageMock.setItem;
      localStorageMock.setItem = vi.fn(() => {
        throw new Error('localStorage full');
      });

      const { result } = renderHook(() => useLocalStorageColor('test-color', '#ffffff'));

      act(() => {
        result.current[1]('#ff0000');
      });

      expect(result.current[0]).toBe('#ff0000'); // State is still updated
      expect(consoleMock).toHaveBeenCalledWith(
        expect.stringContaining('Failed to save test-color to localStorage:'),
        expect.any(Error),
      );

      // Restore original method
      localStorageMock.setItem = originalSetItem;
    });
  });

  describe('multiple instances', () => {
    it('should work with different keys independently', () => {
      const { result: result1 } = renderHook(() => useLocalStorageColor('color1', '#ffffff'));

      const { result: result2 } = renderHook(() => useLocalStorageColor('color2', '#000000'));

      act(() => {
        result1.current[1]('#ff0000');
        result2.current[1]('#00ff00');
      });

      expect(result1.current[0]).toBe('#ff0000');
      expect(result2.current[0]).toBe('#00ff00');
      expect(localStorageMock.getItem('color1')).toBe('#ff0000');
      expect(localStorageMock.getItem('color2')).toBe('#00ff00');
    });
  });

  describe('hook return type', () => {
    it('should return tuple with current value and setter', () => {
      const { result } = renderHook(() => useLocalStorageColor('test-color', '#ffffff'));

      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current).toHaveLength(2);
      expect(typeof result.current[0]).toBe('string');
      expect(typeof result.current[1]).toBe('function');
    });
  });
});
