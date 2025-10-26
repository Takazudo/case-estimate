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

interface NavTextSectionProps {
  blurhash: string;
  title: string;
  titleEn: string;
  description: string;
}

function NavTextSection({ blurhash, title, titleEn, description }: NavTextSectionProps) {
  return (
    <div className="relative grid grid-rows-[1fr]">
      {/* Blurhash background */}
      <div className="absolute inset-0">
        <Blurhash
          hash={blurhash}
          width="100%"
          height="100%"
          resolutionX={32}
          resolutionY={32}
          punch={1}
        />
      </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-zd-black/70 to-zd-black" />

      {/* Content */}
      <div
        className="
          relative flex flex-col
          px-hgap-md py-vgap-md
          md:px-hgap-md md:py-vgap-sm
          lg:px-hgap-md lg:py-vgap-md
          group-hover:bg-zd-white
          group-focus:bg-zd-white
          group-active:bg-zd-active
          group-active:text-zd-black
        "
      >
        <h2 className="flex items-center gap-hgap-xs text-lg md:text-base lg:text-lg font-bold underline leading-tight">
          <ArrowRight className="w-[18px] lg:w-[24px] shrink-0 transition-colors mt-[.1em]" />
          <span className="flex-1">
            <span>{title}</span>{' '}
            <span className="text-base md:text-sm lg:text-base opacity-80">/ {titleEn}</span>
          </span>
        </h2>

        <p className="text-sm lg:text-base pt-vgap-sm md:py-vgap-sm lg:pt-vgap-sm pb-vgap-xs">
          {description}
        </p>
      </div>
    </div>
  );
}

interface NavCardProps {
  item: TopNavItem;
}

function NavCard({ item }: NavCardProps) {
  return (
    <Link href={item.href} className="group flex zd-invert-color-link no-underline">
      <div
        className="
          relative overflow-hidden
          transition-all duration-300 ease-out
          hover:underline
          group-hover:-translate-y-1
          shadow-[0_0_20px_rgba(0,0,0,0.35)]
          border-2 border-zd-white
          h-full w-full
          grid grid-rows-[auto_1fr]
        "
      >
        <NavImage
          imageSlug={item.imageSlug}
          blurhash={item.blurhash}
          alt={`${item.title} / ${item.titleEn}`}
        />
        <NavTextSection
          blurhash={item.blurhash}
          title={item.title}
          titleEn={item.titleEn}
          description={item.description}
        />
      </div>
    </Link>
  );
}

export default function TopNavGrid({ className = '' }: TopNavGridProps) {
  return (
    <div
      className={`
        grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3
        2xl:mx-[-100px]
        gap-x-hgap-sm gap-y-vgap-sm
        ${className}
      `}
    >
      {topNavItems.map((item) => (
        <NavCard key={item.id} item={item} />
      ))}
    </div>
  );
}
