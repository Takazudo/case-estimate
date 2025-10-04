'use client';

import { galleryData } from '@/data/gallery-data';
import GalleryThumbnailGrid from '@/components/gallery-thumbnail-grid';
import GalleryDialog from '@/components/gallery-dialog';
import { useSearchParams } from 'next/navigation';

export default function GalleryPage() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');

  return (
    <>
      <div className="min-h-screen bg-black">
        <div className="py-8">
          <h1>Gallery</h1>
          <GalleryThumbnailGrid items={galleryData} />
        </div>
      </div>
      {selectedId && <GalleryDialog slug={selectedId} />}
    </>
  );
}
