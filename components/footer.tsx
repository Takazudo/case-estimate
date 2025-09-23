'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const goUp = () => {
  // Find the scrollable container in ContentLayout
  const scrollContainer = document.querySelector('.overflow-y-auto');
  if (scrollContainer) {
    scrollContainer.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  } else {
    // Fallback to window scroll
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
};

export default function Footer() {
  const pathname = usePathname();
  const isActiveTop = pathname === '/';
  const isActiveModules = pathname === '/modules';

  return (
    <footer className="w-full max-w-[1800px] mx-auto pb-8 px-4">
      <div className="pt-8 flex items-center justify-between border-t border-dashed border-zd-gray">
        <nav>
          <ul className="flex flex-col md:flex-row gap-x-4 gap-y-2">
            <li className="whitespace-nowrap">
              <Link
                href="/"
                className={`text-zd-white hover:text-zd-gray transition-colors ${
                  isActiveTop ? 'pointer-events-none opacity-50' : ''
                }`}
                tabIndex={isActiveTop ? -1 : 0}
              >
                takazudomodular.com
              </Link>
            </li>
            <li className="whitespace-nowrap flex items-center">
              <span className="mr-2 hidden md:block text-zd-gray">/</span>
              <Link
                href="/modules"
                className={`text-zd-white hover:text-zd-gray transition-colors ${
                  isActiveModules ? 'pointer-events-none opacity-50' : ''
                }`}
                tabIndex={isActiveModules ? -1 : 0}
              >
                モジュール一覧
              </Link>
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
          onClick={goUp}
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
