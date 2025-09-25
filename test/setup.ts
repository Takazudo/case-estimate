import '@testing-library/jest-dom';
import React from 'react';

// Vitest with JSX compile set to "preserve" expects React to exist globally.
// Next.js injects this in the app runtime, so we mirror that behavior for tests.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).React = React;
