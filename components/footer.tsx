'use client';

import NavigationLink from '@/components/navigation-link';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

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
            <svg
              className="h-10 w-10 group-hover:-translate-y-1 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 19V5M12 5L5 12M12 5L19 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
