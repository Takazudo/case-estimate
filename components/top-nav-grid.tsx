'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Blurhash } from '@/components/blurhash';
import { getStaticImageUrl } from '@/utils/cdn-urls';
import ArrowRight from '@/components/icons/arrow-right';
import { TOP_NAV_ITEMS, type TopNavItem } from '@/data/navigation';

interface TopNavGridProps {
  className?: string;
}

/**
 * Navigation grid for the homepage
 * Displays 6 navigation cards in a responsive grid layout with image previews,
 * blurhash placeholders, and descriptions
 *
 * Layout: 1 column on mobile, 2 on tablet, 3 on desktop
 */
interface NavImageProps {
  imageSlug: string;
  blurhash: string;
  alt: string;
}

function NavImage({ imageSlug, blurhash, alt }: NavImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageUrl = getStaticImageUrl(imageSlug, '1200w');

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
      <div className="absolute inset-0 bg-gradient-to-b from-zd-black/70 to-zd-black" />

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
        <h2 className="flex items-center gap-hgap-xs text-lg md:text-base lg:text-lg font-bold underline leading-tight font-futura">
          <ArrowRight className="w-[18px] lg:w-[24px] shrink-0 transition-colors mt-[.1em]" />
          <span className="flex-1">
            <span>{title}</span>{' '}
            <span className="text-base md:text-sm lg:text-base opacity-80">/ {titleEn}</span>
          </span>
        </h2>

        <p className="text-sm lg:text-base pt-vgap-sm md:py-vgap-sm lg:pt-vgap-sm pb-vgap-xs font-normal text-shadow-none">
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
      {TOP_NAV_ITEMS.map((item) => (
        <NavCard key={item.id} item={item} />
      ))}
    </div>
  );
}
