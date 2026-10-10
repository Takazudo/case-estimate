import type { Child } from '@takazudo/zfb/zudo-react';
interface ModelSectionGalleryProps {
  children: Child;
}
export default function ModelSectionGallery({ children }: ModelSectionGalleryProps) {
  return <div class="md:pt-vgap-sm lg:pt-vgap-lg">{children}</div>;
}
