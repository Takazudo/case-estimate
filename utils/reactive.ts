import type { ReadonlySignal } from '@takazudo/zfb/zudo-react';

export type Reactive<T> = T | ReadonlySignal<T>;

export function read<T>(value: Reactive<T>): T {
  return typeof value === 'object' &&
    value !== null &&
    '$$zudoReactive' in value &&
    value.$$zudoReactive === 'zudo-react.reactive.v1'
    ? (value as ReadonlySignal<T>).value
    : (value as T);
}
