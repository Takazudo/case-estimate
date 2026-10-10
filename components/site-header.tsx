import AppHeader from '@/components/app-header';
import { createNavigationController } from '@/components/navigation-context';

export default function SiteHeader({ currentPath = '' }: { currentPath?: string }) {
  const navigation = createNavigationController(currentPath);
  return <AppHeader currentPath={navigation.currentPath} navigation={navigation} />;
}
