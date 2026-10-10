'use client';

import { computed, Show } from '@takazudo/zfb/zudo-react';
import type { HTMLAttributes } from '@takazudo/zfb/zudo-react';
import type { Reactive } from '@/utils/reactive';
import { read } from '@/utils/reactive';
import PatternFill from '@/components/pattern-fill';
import { isPanelPattern } from '@/utils/panel-patterns';
import { resolvePanelColorBackground } from '@/utils/panel-color-utils';
import { DEFAULT_PANEL_COLOR } from '@/data/colors';

export interface PanelColorSwatchProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  'style' | 'className' | 'value'
> {
  value?: Reactive<string | undefined>;
  fallbackColor?: Reactive<string>;
  patternViewBoxSize?: Reactive<number>;
  className?: Reactive<string>;
  style?: Reactive<Record<string, string | number | undefined>>;
  dataTestId?: string;
  ownerKey: string;
}

const PanelColorSwatch = ({
  value,
  fallbackColor = DEFAULT_PANEL_COLOR,
  patternViewBoxSize = 24,
  className = '',
  style,
  dataTestId = 'panel-color-swatch',
  ownerKey,
  'aria-hidden': ariaHiddenProp,
  ...rest
}: PanelColorSwatchProps) => {
  const currentValue = computed(() => (value === undefined ? undefined : read(value)));
  const background = computed(() =>
    resolvePanelColorBackground(currentValue.value, read(fallbackColor)),
  );
  const mergedStyle = computed(() => ({
    ...(style === undefined ? {} : read(style)),
    'background-color': background.value,
  }));
  return (
    <span
      data-testid={dataTestId}
      class={className}
      style={mergedStyle}
      aria-hidden={ariaHiddenProp ?? true}
      {...rest}
    >
      <Show when={computed(() => !!currentValue.value && isPanelPattern(currentValue.value))}>
        {() => (
          <PatternFill
            ownerKey={ownerKey}
            pattern={computed(() => currentValue.value as never)}
            className="absolute inset-0 w-full h-full"
            viewBoxSize={patternViewBoxSize}
          />
        )}
      </Show>
    </span>
  );
};

export default PanelColorSwatch;
