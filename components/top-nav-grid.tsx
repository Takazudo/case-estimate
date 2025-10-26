'use client';

import React from 'react';
import Link from 'next/link';
import { Blurhash } from '@/components/blurhash';
import ArrowRight from '@/components/icons/arrow-right';

interface TopNavItem {
  id: string;
  href: string;
  title: string;
  titleEn: string;
  description: string;
  imageSlug: string;
  blurhash: string;
}

const topNavItems: TopNavItem[] = [
  {
    id: 'gallery',
    href: '/gallery',
    title: 'ギャラリー',
    titleEn: 'Gallery',
    description:
      'まずはどのようなケースなのか、ギャラリーページに写真をまとめています。 ケースの雰囲気を知りたい場合にご覧頂ければと。',
    imageSlug: 'panels-top-thumb-1',
    blurhash: 'UBDb1ppI}?xDtk$#s:bEtQ10,pNcw3F{FLag',
  },
  {
    id: 'case-models',
    href: '/case-models',
    title: 'ケースの種類',
    titleEn: 'Case Models',
    description:
      'このケースで使えるパネルはアクリルボード、3Dプリンタ製パネルの二種類。全種類を写真付きで紹介しています。',
    imageSlug: 'panels-top-thumb-2',
    blurhash: 'UAE-Ku}*5kF_7cW;wgM#M#ER11M|$%FJi{=^',
  },
  {
    id: 'panel-materials',
    href: '/panel',
    title: 'パネル素材',
    titleEn: 'Panel Materials',
    description:
      'このケースで使えるパネルはアクリルボード、3Dプリンタ製パネルの二種類。全種類を以下で紹介しています。',
    imageSlug: 'panels-top-thumb-3',
    blurhash: 'UxHcs3|{+|X3]~#Sw0XRS~NeR.kCbuj]s8wc',
  },
  {
    id: 'case-builder',
    href: '/m',
    title: 'ケースビルダー',
    titleEn: 'Case Builder',
    description: '展開図を元に各部の色割り当てたイメージを確認していただくことが可能です。',
    imageSlug: 'panels-top-thumb-4',
    blurhash: 'UXGHrMD%k=xH~Cxun*kWrr?aRjbbR*%fs:NH',
  },
  {
    id: 'pricing',
    href: '/price',
    title: '価格',
    titleEn: 'Pricing',
    description:
      'このケースで使えるパネルはアクリルボード、3Dプリンタ製パネルの二種類。全種類を以下で紹介しています。',
    imageSlug: 'panels-top-thumb-5',
    blurhash: 'UNC$[zDi~paJ%Mivt7nixFRjayWCs:WXWBof',
  },
  {
    id: 'faq',
    href: '/faq',
    title: 'よくあるご質問',
    titleEn: 'FAQ',
    description: '展開図を元に各部の色割り当てたイメージを確認していただくことが可能です。',
    imageSlug: 'panels-top-thumb-6',
    blurhash: 'UEJ$WsNd=s^iAHAGr?-U9_R+ays.}q-AW;R+',
  },
];

interface TopNavGridProps {
  className?: string;
}

export default function TopNavGrid({ className = '' }: TopNavGridProps) {
  return (
    <div
      className={`
        grid grid-cols-1 lg:grid-cols-2
        gap-hgap-lg gap-y-vgap-lg
        ${className}
      `}
    >
      {topNavItems.map((item) => {
        return (
          <Link
            key={item.id}
            href={item.href}
            className="group relative block focus-visible:outline-none"
          >
            <div
              className="
                relative overflow-hidden rounded-md border-[3px] border-zd-white
                transition-all duration-300 ease-out
                group-hover:border-zd-link group-hover:-translate-y-1
                shadow-[0_0_20px_rgba(0,0,0,0.35)]
              "
            >
              {/* Blurhash background with aspect ratio */}
              <div className="relative w-full" style={{ paddingBottom: '63.35%' }}>
                <div className="absolute inset-0">
                  <Blurhash
                    hash={item.blurhash}
                    width="100%"
                    height="100%"
                    resolutionX={32}
                    resolutionY={32}
                    punch={1}
                  />
                </div>
                {/* Gradient overlay */}
                <div
                  className="
                    absolute inset-0 transition-all duration-300
                    bg-gradient-to-b from-black/30 via-black/70 to-black/80
                  "
                />
              </div>

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-hgap-sm pb-vgap-md">
                <div>
                  {/* Heading with arrow */}
                  <h2 className="flex items-center gap-hgap-xs text-lg lg:text-xl font-bold text-zd-white">
                    <ArrowRight className="w-[18px] flex-shrink-0 group-hover:text-zd-link transition-colors" />
                    <span className="flex-1">
                      <span>{item.title}</span>{' '}
                      <span className="text-base lg:text-lg opacity-80">/ {item.titleEn}</span>
                    </span>
                  </h2>

                  {/* Description */}
                  <p className="mt-vgap-xs text-sm lg:text-base text-zd-white leading-snug max-w-[420px]">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
