'use client';

import { For, signal } from '@takazudo/zfb/zudo-react';
import { encodeCase } from '@/utils/url-encoder';
import { BlurhashLoader } from '@/components/blurhash-loader';

interface GridImageItem {
  id: string;
  href?: string;
  caseId?: string;
  caption: string;
  imgSrc?: string;
  blurhash?: string;
}
interface GridImagesProps {
  items: GridImageItem[];
  onItemClick?: (caseId: string) => void;
  className?: string;
}

export default function GridImages({ items, onItemClick, className = '' }: GridImagesProps) {
  const href = (item: GridImageItem) =>
    item.href || (item.caseId ? `/m?c=${encodeCase(item.caseId)}` : '#');
  return (
    <div class={`grid grid-cols-2 md:grid-cols-4 gap-hgap-sm md:gap-hgap-sm ${className}`}>
      <For each={signal(items)} by={(item) => item.id}>
        {(entry) => {
          const item = entry.value;
          return (
            <a
              href={href(item)}
              on:click={() => onItemClick?.(item.caseId || '')}
              class="group block cursor-pointer border-[3px] border-zd-link rounded-md p-[3px]"
            >
              <div class="space-y-vgap-xs">
                <div class="aspect-square bg-white rounded-sm overflow-hidden">
                  {item.imgSrc ? (
                    item.blurhash ? (
                      <BlurhashLoader
                        blurHash={item.blurhash}
                        imgUrl={item.imgSrc}
                        alt={item.caption}
                        className="w-full h-full"
                        loading="lazy"
                      />
                    ) : (
                      <img
                        src={item.imgSrc}
                        alt={item.caption}
                        class="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )
                  ) : (
                    <div class="w-full h-full" />
                  )}
                </div>
                <p class="py-vgap-sm text-center group-hover:text-zd-link transition-colors">
                  {item.caption}
                </p>
              </div>
            </a>
          );
        }}
      </For>
    </div>
  );
}
