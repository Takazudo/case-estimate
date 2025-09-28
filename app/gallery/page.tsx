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
        <div className="container mx-auto px-4 py-8">
          <h1 className="sr-only">Gallery</h1>
          <GalleryThumbnailGrid items={galleryData} />
        </div>
      </div>
      {selectedId && <GalleryDialog slug={selectedId} />}
    </>
  );
}
