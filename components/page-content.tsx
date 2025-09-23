'use client';

import React from 'react';
import { useNavigation } from './navigation-context';

interface PageContentProps {
  children: React.ReactNode;
}

export default function PageContent({ children }: PageContentProps) {
  const { pageAnimationClass } = useNavigation();

  return <main className={`${pageAnimationClass}`}>{children}</main>;
}
