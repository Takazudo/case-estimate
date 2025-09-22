'use client';

import AppHeader from './app-header';
import { useNavigation } from './navigation-context';

export default function PersistentHeader() {
  const { currentLayout } = useNavigation();

  return <AppHeader layout={currentLayout} />;
}
