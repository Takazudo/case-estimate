import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { h } from '@takazudo/zfb/zudo-react';
import type { Signal } from '@takazudo/zfb/zudo-react';
import { createIslandTest } from '@takazudo/zfb/zudo-react/testing';
import { useLocalStorageColor } from './use-local-storage-color';

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
Object.defineProperty(window, 'localStorage', { value: localStorageMock, configurable: true });
const consoleMock = vi.spyOn(console, 'warn').mockImplementation(() => {});
const active: Array<ReturnType<typeof createIslandTest>> = [];

function renderColor(key: string, defaultValue: string) {
  let result!: readonly [Signal<string>, (value: string) => void];
  function ColorTest() {
    result = useLocalStorageColor(key, defaultValue);
    return h('span', null, result[0]);
  }
  const test = createIslandTest(ColorTest, {}, { document });
  active.push(test);
  expect(test.mount()).not.toBeNull();
  return {
    result: {
      get current() {
        return result;
      },
    },
    test,
  };
}

beforeEach(() => {
  localStorageMock.clear();
  consoleMock.mockClear();
});
afterEach(() => {
  for (const test of active) test.dispose();
  active.length = 0;
});

describe('useLocalStorageColor', () => {
  it('uses default value when localStorage is empty', () => {
    expect(renderColor('test-color', '#ffffff').result.current[0].value).toBe('#ffffff');
  });
  it('uses stored value when localStorage has valid color', () => {
    localStorageMock.setItem('test-color', '#ff0000');
    expect(renderColor('test-color', '#ffffff').result.current[0].value).toBe('#ff0000');
  });
  it('uses default value when localStorage has invalid color', () => {
    localStorageMock.setItem('test-color', 'invalid-color');
    expect(renderColor('test-color', '#ffffff').result.current[0].value).toBe('#ffffff');
  });
  it('uses default value and warns when localStorage read throws', () => {
    const original = localStorageMock.getItem;
    localStorageMock.getItem = vi.fn(() => {
      throw new Error('localStorage unavailable');
    });
    try {
      expect(renderColor('test-color', '#ffffff').result.current[0].value).toBe('#ffffff');
      expect(consoleMock).toHaveBeenCalledWith(
        expect.stringContaining('Failed to read test-color from localStorage:'),
        expect.any(Error),
      );
    } finally {
      localStorageMock.getItem = original;
    }
  });
  it('accepts valid 6-digit hex colors', () => {
    for (const color of ['#000000', '#ffffff', '#FF0000', '#00ff00', '#0000FF']) {
      localStorageMock.setItem('test-color', color);
      expect(renderColor('test-color', '#ffffff').result.current[0].value).toBe(color);
    }
  });
  it('rejects invalid hex colors', () => {
    for (const color of ['#fff', '#fffffff', 'ffffff', '#gggggg', 'red', 'rgb(255,0,0)']) {
      localStorageMock.setItem('test-color', color);
      expect(renderColor('test-color', '#ffffff').result.current[0].value).toBe('#ffffff');
    }
  });
  it('updates color and saves to localStorage', async () => {
    const { result, test } = renderColor('test-color', '#ffffff');
    result.current[1]('#ff0000');
    await test.flush();
    expect(result.current[0].value).toBe('#ff0000');
    expect(localStorageMock.getItem('test-color')).toBe('#ff0000');
  });
  it('updates state but does not save invalid colors', async () => {
    const { result, test } = renderColor('test-color', '#ffffff');
    localStorageMock.clear();
    result.current[1]('invalid-color');
    await test.flush();
    expect(result.current[0].value).toBe('invalid-color');
    expect(localStorageMock.getItem('test-color')).toBe(null);
    expect(consoleMock).toHaveBeenCalledWith(
      'Invalid color value for test-color:',
      'invalid-color',
    );
  });
  it('keeps state and warns when localStorage save throws', async () => {
    const original = localStorageMock.setItem;
    localStorageMock.setItem = vi.fn(() => {
      throw new Error('localStorage full');
    });
    try {
      const { result, test } = renderColor('test-color', '#ffffff');
      result.current[1]('#ff0000');
      await test.flush();
      expect(result.current[0].value).toBe('#ff0000');
      expect(consoleMock).toHaveBeenCalledWith(
        expect.stringContaining('Failed to save test-color to localStorage:'),
        expect.any(Error),
      );
    } finally {
      localStorageMock.setItem = original;
    }
  });
  it('keeps separate keys independent', async () => {
    const first = renderColor('color1', '#ffffff');
    const second = renderColor('color2', '#000000');
    first.result.current[1]('#ff0000');
    second.result.current[1]('#00ff00');
    await first.test.flush();
    await second.test.flush();
    expect(first.result.current[0].value).toBe('#ff0000');
    expect(second.result.current[0].value).toBe('#00ff00');
    expect(localStorageMock.getItem('color1')).toBe('#ff0000');
    expect(localStorageMock.getItem('color2')).toBe('#00ff00');
  });
  it('returns a signal and setter tuple', () => {
    const { result } = renderColor('test-color', '#ffffff');
    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current).toHaveLength(2);
    expect(typeof result.current[0].value).toBe('string');
    expect(typeof result.current[1]).toBe('function');
  });
});
