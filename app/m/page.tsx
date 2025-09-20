import Configurator from '@/components/configurator';
import ErrorBoundary from '@/components/error-boundary';

interface PageProps {
  searchParams: Promise<{
    c?: string;
    p?: string;
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  // Await searchParams as required by Next.js 15
  const params = await searchParams;

  // Pass the initial search params to the client component
  // Ensure undefined is not passed to avoid hydration issues
  return (
    <ErrorBoundary>
      <Configurator initialCase={params?.c || undefined} initialPanels={params?.p || undefined} />
    </ErrorBoundary>
  );
}
