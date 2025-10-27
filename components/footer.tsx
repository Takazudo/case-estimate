'use client';

import NavigationLink from '@/components/navigation-link';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { ArrowUpIcon } from '@/components/icons/arrow-up-icon';

export default function Footer() {
  const scrollToTop = useScrollToTop();

  return (
    <footer className="w-full pb-8 px-hgap-md border-t border-dashed border-zd-gray">
      <div className="max-w-[1280px] mx-auto">
        <div className="pt-8 flex items-center justify-between">
          <nav>
            <ul className="flex flex-col md:flex-row gap-x-4 gap-y-2">
              <li className="whitespace-nowrap">
                <NavigationLink
                  href="/"
                  className="text-zd-white hover:text-zd-gray transition-colors"
                >
                  takazudomodular.com
                </NavigationLink>
              </li>
            </ul>
          </nav>
          <button
            className="flex items-center text-zd-white hover:text-zd-gray transition-colors group"
            onClick={scrollToTop}
            aria-label="ページの先頭へ"
          >
            <span className="underline mr-2 hidden sm:block">ページの先頭へ</span>
            <ArrowUpIcon className="h-10 w-10 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
