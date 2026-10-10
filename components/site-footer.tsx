import Footer from '@/components/footer';
import { createNavigationController } from '@/components/navigation-context';

export default function SiteFooter() {
  const navigation = createNavigationController();
  return <Footer navigation={navigation} />;
}
