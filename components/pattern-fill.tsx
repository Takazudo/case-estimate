'use client';

import { computed } from '@takazudo/zfb/zudo-react';
import type { Reactive } from '@/utils/reactive';
import { read } from '@/utils/reactive';
import type { PanelPatternKey } from '@/utils/panel-patterns';
import { getPanelPatternDefinition } from '@/utils/panel-patterns';

interface PatternFillProps {
  pattern: Reactive<PanelPatternKey>;
  className?: Reactive<string>;
  viewBoxSize?: Reactive<number>;
  ownerKey: string;
}

const PatternFill = ({ pattern, className = '', viewBoxSize = 24, ownerKey }: PatternFillProps) => {
  // An SVG image is its own document. Its fragment ID cannot collide with any
  // other swatch, and the data URI is identical during SSR and hydration.
  const image = computed(() => {
    const definition = getPanelPatternDefinition(read(pattern));
    const size = read(viewBoxSize);
    const id = `stripe-${Array.from(ownerKey, (char) => char.codePointAt(0)!.toString(16)).join('-')}`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><defs><pattern id="${id}" patternUnits="userSpaceOnUse" width="${definition.patternSize}" height="${definition.patternSize}" patternTransform="rotate(${definition.rotation})"><rect width="${definition.patternSize}" height="${definition.patternSize}" fill="${definition.baseColor}"/><rect width="${definition.stripeWidth}" height="${definition.patternSize}" fill="${definition.accentColor}"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  });
  return (
    <svg
      class={className}
      viewBox={computed(() => `0 0 ${read(viewBoxSize)} ${read(viewBoxSize)}`)}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <image width="100%" height="100%" href={image} preserveAspectRatio="none" />
    </svg>
  );
};

export default PatternFill;
