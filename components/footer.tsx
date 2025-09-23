'use client';

import { usePathname } from 'next/navigation';
import NavigationLink from '@/components/navigation-link';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

export default function Footer() {
  const pathname = usePathname();
  const isActiveTop = pathname === '/';
  const isActiveModules = pathname === '/modules';
  const scrollToTop = useScrollToTop();

  return (
    <footer className="w-full max-w-[1800px] mx-auto pb-8 px-4">
      <div className="pt-8 flex items-center justify-between border-t border-dashed border-zd-gray">
        <nav>
          <ul className="flex flex-col md:flex-row gap-x-4 gap-y-2">
            <li className="whitespace-nowrap">
              {isActiveTop ? (
                <span className="text-zd-white opacity-50 cursor-default">takazudomodular.com</span>
              ) : (
                <NavigationLink
                  href="/"
                  className="text-zd-white hover:text-zd-gray transition-colors"
                >
                  takazudomodular.com
                </NavigationLink>
              )}
            </li>
            <li className="whitespace-nowrap flex items-center">
              <span className="mr-2 hidden md:block text-zd-gray">/</span>
              {isActiveModules ? (
                <span className="text-zd-white opacity-50 cursor-default">モジュール一覧</span>
              ) : (
                <NavigationLink
                  href="/modules"
                  className="text-zd-white hover:text-zd-gray transition-colors"
                >
                  モジュール一覧
                </NavigationLink>
              )}
            </li>
            <li className="whitespace-nowrap flex items-center">
              <span className="mr-2 hidden md:block text-zd-gray">/</span>
              <a
                href="https://takazudomodular.com/contact/"
                className="text-zd-white hover:text-zd-gray transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                お問い合わせ
              </a>
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
    </footer>
  );
}
