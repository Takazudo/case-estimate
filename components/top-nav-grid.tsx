'use client';

import React, { useState } from 'react';
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

interface NavImageProps {
  imageSlug: string;
  blurhash: string;
  alt: string;
}

function NavImage({ imageSlug, blurhash, alt }: NavImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageUrl = `https://takazudomodular.com/static/images/p/${imageSlug}/1200w.webp`;

  return (
    <div className="relative w-full overflow-hidden" style={{ paddingBottom: '63.35%' }}>
      <div className="absolute inset-0">
        {/* Blurhash placeholder */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}
        >
          <Blurhash
            hash={blurhash}
            width="100%"
            height="100%"
            resolutionX={32}
            resolutionY={32}
            punch={1}
          />
        </div>
        {/* Actual image */}
        <img
          src={imageUrl}
          alt={alt}
          className={`w-full h-full object-contain transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />
      </div>
    </div>
  );
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
            className="group block bg-zd-black border-[3px] border-zd-white rounded-md overflow-hidden hover:border-zd-link transition-colors"
          >
            {/* Image with aspect ratio ~63% */}
            <NavImage
              imageSlug={item.imageSlug}
              blurhash={item.blurhash}
              alt={`${item.title} / ${item.titleEn}`}
            />

            {/* Content */}
            <div className="p-hgap-sm pb-vgap-md">
              {/* Heading with arrow */}
              <h2 className="flex items-center gap-hgap-xs pb-vgap-sm text-lg lg:text-xl font-bold border-b-[3px] border-zd-white mb-vgap-sm">
                <ArrowRight className="w-[18px] flex-shrink-0 group-hover:text-zd-link transition-colors" />
                <span className="flex-1">
                  <span>{item.title}</span>{' '}
                  <span className="text-base lg:text-lg opacity-80">/ {item.titleEn}</span>
                </span>
              </h2>

              {/* Description */}
              <p className="text-sm lg:text-base text-zd-white/90">{item.description}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
