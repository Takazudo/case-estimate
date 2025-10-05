'use client';

import { galleryData } from '@/data/gallery-data';
import GalleryThumbnailGrid from '@/components/gallery-thumbnail-grid';
import GalleryDialog from '@/components/gallery-dialog';
import { useSearchParams } from 'next/navigation';
import { H1 } from '@/components/article/h1';
import { P } from '@/components/article/p';

export default function GalleryPage() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');

  return (
    <>
      <div className="min-h-screen bg-black">
        <div className="py-8">
          <H1>ギャラリー / Gallery</H1>
          <div className="text-center -mt-vgap-md">
            <P>
              ケース関連の写真です。色々ありすぎて分からんという場合、
              <br />
              これどれですかなどとURLと共にお気軽にお問い合わせください。
            </P>
          </div>
          <GalleryThumbnailGrid items={galleryData} />
        </div>
      </div>
      {selectedId && <GalleryDialog slug={selectedId} />}
    </>
  );
}
