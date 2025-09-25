import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Configurator from './configurator';

const replaceMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
  usePathname: () => '/m',
}));

describe('Configurator', () => {
  beforeEach(() => {
    replaceMock.mockClear();
    window.localStorage.clear();
  });

  it('activates custom tab when URL colors do not match any series', async () => {
    window.history.pushState({}, '', '/m?c=2a&p=1cb.2cr.7cb.8ib.5cb.6dy.3cb.4cb');

    render(<Configurator />);

    await expect(screen.findByLabelText('Select サイド1')).resolves.toBeInTheDocument();
  });
});
