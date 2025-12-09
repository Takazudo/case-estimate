import { describe, it, expect } from 'vitest';
import {
  encodePanelColors,
  decodePanelColors,
  encodeCase,
  decodeCase,
  createColorIdMap,
  createColorValueMap,
} from './url-encoder';

describe('url-encoder', () => {
  describe('createColorIdMap', () => {
    it('should create mapping from color values to IDs', () => {
      const map = createColorIdMap();
      // Tests against actual color data from @/data/colors
      expect(map).toBeDefined();
      expect(typeof map).toBe('object');
    });
  });

  describe('createColorValueMap', () => {
    it('should create mapping from color IDs to values', () => {
      const map = createColorValueMap();
      // Tests against actual color data from @/data/colors
      expect(map).toBeDefined();
      expect(typeof map).toBe('object');
    });
  });

  describe('encodeCase', () => {
    it('should encode known case types', () => {
      expect(encodeCase('zudo-block-40-ACR-A')).toBe('1a');
      expect(encodeCase('zudo-block-60-3DP-B')).toBe('4b');
      expect(encodeCase('10box-shallow-3dp')).toBe('9a');
      expect(encodeCase('10box-deep-3dp')).toBe('9b');
    });

    it('should return original string for unknown case types', () => {
      expect(encodeCase('unknown-case')).toBe('unknown-case');
    });
  });

  describe('decodeCase', () => {
    it('should decode known case codes', () => {
      expect(decodeCase('1a')).toBe('zudo-block-40-ACR-A');
      expect(decodeCase('4b')).toBe('zudo-block-60-3DP-B');
      expect(decodeCase('9a')).toBe('10box-shallow-3dp');
      expect(decodeCase('9b')).toBe('10box-deep-3dp');
      expect(decodeCase('oa')).toBe('zudo-block-60-open-ACR-A');
      expect(decodeCase('pu')).toBe('zudo-block-60-open-upgrade-3DP');
    });

    it('should return null for unknown codes', () => {
      expect(decodeCase('zz')).toBe(null);
      expect(decodeCase('')).toBe(null);
    });
  });

  describe('encodePanelColors', () => {
    it('should encode panel color IDs to compact string', () => {
      const panelColorIds = {
        side1: 'red',
        front1: 'clear',
        bottom1: 'carbon-black',
      };

      const encoded = encodePanelColors(panelColorIds);
      expect(encoded).toContain('1r'); // side1 + red
      expect(encoded).toContain('3c'); // front1 + clear
      expect(encoded).toContain('5cb'); // bottom1 + carbon-black
      expect(encoded.split('.')).toHaveLength(3);
    });

    it('should handle empty panel colors', () => {
      const encoded = encodePanelColors({});
      expect(encoded).toBe('');
    });

    it('should skip panels with unknown color IDs', () => {
      const panelColorIds = {
        side1: 'red', // valid
        front1: 'unknown-color', // unknown color ID
      };

      const encoded = encodePanelColors(panelColorIds);
      expect(encoded).toBe('1r'); // Only side1 should be encoded
    });

    it('should handle 10BOX panels with m/l prefixes', () => {
      const panelColorIds = {
        'main-side1': 'red',
        'lid-top1': 'clear',
      };

      const encoded = encodePanelColors(panelColorIds);
      expect(encoded).toContain('m1r'); // main-side1 + red
      expect(encoded).toContain('l4c'); // lid-top1 + clear
    });

    it('should distinguish between clear-red and crimson-red', () => {
      const clearRedPanels = { side1: 'clear-red' };
      const crimsonRedPanels = { side1: 'crimson-red' };

      expect(encodePanelColors(clearRedPanels)).toBe('1rd');
      expect(encodePanelColors(crimsonRedPanels)).toBe('1cr');
      expect(encodePanelColors(clearRedPanels)).not.toBe(encodePanelColors(crimsonRedPanels));
    });
  });

  describe('decodePanelColors', () => {
    it('should decode panel color IDs from compact string', () => {
      const encoded = '1r.3c.5cb'; // side1=red, front1=clear, bottom1=carbon-black
      const decoded = decodePanelColors(encoded);

      expect(decoded.side1).toBe('red');
      expect(decoded.front1).toBe('clear');
      expect(decoded.bottom1).toBe('carbon-black');
    });

    it('should handle empty encoded string', () => {
      const decoded = decodePanelColors('');
      expect(Object.keys(decoded)).toHaveLength(0);
    });

    it('should handle 10BOX panels with m/l prefixes', () => {
      const encoded = 'm1r.l4c'; // main-side1=red, lid-top1=clear
      const decoded = decodePanelColors(encoded);

      expect(decoded['main-side1']).toBe('red');
      expect(decoded['lid-top1']).toBe('clear');
    });

    it('should skip invalid panel/color codes', () => {
      const encoded = '1r.zzz.3c'; // valid, invalid, valid
      const decoded = decodePanelColors(encoded);

      expect(decoded.side1).toBe('red');
      expect(decoded.front1).toBe('clear');
      expect(decoded.zzz).toBeUndefined();
    });

    it('should handle mixed regular and 10BOX panels', () => {
      const encoded = '1r.m1c.3cb.l4r'; // side1, main-side1, front1, lid-top1
      const decoded = decodePanelColors(encoded);

      expect(decoded.side1).toBe('red');
      expect(decoded['main-side1']).toBe('clear');
      expect(decoded.front1).toBe('carbon-black');
      expect(decoded['lid-top1']).toBe('red');
    });

    it('should preserve clear-red vs crimson-red distinction', () => {
      const clearRedEncoded = '1rd';
      const crimsonRedEncoded = '1cr';

      expect(decodePanelColors(clearRedEncoded)).toEqual({ side1: 'clear-red' });
      expect(decodePanelColors(crimsonRedEncoded)).toEqual({ side1: 'crimson-red' });
    });
  });

  describe('round-trip encoding/decoding', () => {
    it('should maintain data integrity through encode/decode cycle', () => {
      const originalPanelColorIds = {
        side1: 'red',
        front1: 'clear',
        bottom1: 'carbon-black',
        'main-side1': 'crimson-red',
        'lid-top1': 'bone-white',
      };

      const encoded = encodePanelColors(originalPanelColorIds);
      const decoded = decodePanelColors(encoded);

      expect(decoded).toEqual(originalPanelColorIds);
    });

    it('should preserve clear-red vs crimson-red distinction in round-trip', () => {
      const panelColorIds = {
        side1: 'clear-red',
        side2: 'crimson-red',
        back1: 'clear-blue',
      };

      const encoded = encodePanelColors(panelColorIds);
      const decoded = decodePanelColors(encoded);

      expect(decoded).toEqual(panelColorIds);
      expect(decoded.side1).toBe('clear-red');
      expect(decoded.side2).toBe('crimson-red');
      expect(decoded.back1).toBe('clear-blue');
    });

    it('should handle pattern colors like red-green-silk in round-trip', () => {
      const panelColorIds = {
        side1: 'red-green-silk',
        front1: 'carbon-black',
        back1: 'clear-blue',
      };

      const encoded = encodePanelColors(panelColorIds);
      const decoded = decodePanelColors(encoded);

      expect(decoded).toEqual(panelColorIds);
      expect(decoded.side1).toBe('red-green-silk');
      expect(decoded.front1).toBe('carbon-black');
      expect(decoded.back1).toBe('clear-blue');
    });
  });
});
