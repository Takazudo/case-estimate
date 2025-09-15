import ArticleH2 from './article/article-h2';
import ArticleText from './article/article-text';
import { GridImagesAndNotes } from './article/grid-images-and-notes';
import type { GridItem } from './article/grid-images-and-notes';

export default function PanelMaterialPage() {
  // Acrylic Panels data
  const acrylicPanels: GridItem[] = [
    {
      imageUrl: '/placeholder-white.png',
      imageAlt: 'カーボンブラック',
      heading: 'カーボンブラック',
      content: (
        <>
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore vip ex
          </p>
        </>
      ),
    },
    {
      imageUrl: '/placeholder-white.png',
      imageAlt: 'カーボンブラック',
      heading: 'カーボンブラック',
      content: (
        <>
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore vip ex
          </p>
        </>
      ),
    },
    {
      imageUrl: '/placeholder-white.png',
      imageAlt: 'カーボンブラック',
      heading: 'カーボンブラック',
      content: (
        <>
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore vip ex
          </p>
        </>
      ),
    },
    {
      imageUrl: '/placeholder-white.png',
      imageAlt: 'カーボンブラック',
      heading: 'カーボンブラック',
      content: (
        <>
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore vip ex
          </p>
        </>
      ),
    },
  ];

  // 3D Printed Panels data
  const printedPanels: GridItem[] = [
    {
      imageUrl: '/placeholder-white.png',
      imageAlt: 'カーボンブラック',
      heading: 'カーボンブラック',
      content: (
        <>
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore vip ex
          </p>
        </>
      ),
    },
    {
      imageUrl: '/placeholder-white.png',
      imageAlt: 'カーボンブラック',
      heading: 'カーボンブラック',
      content: (
        <>
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore vip ex
          </p>
        </>
      ),
    },
    {
      imageUrl: '/placeholder-white.png',
      imageAlt: 'カーボンブラック',
      heading: 'カーボンブラック',
      content: (
        <>
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore vip ex
          </p>
        </>
      ),
    },
    {
      imageUrl: '/placeholder-white.png',
      imageAlt: 'カーボンブラック',
      heading: 'カーボンブラック',
      content: (
        <>
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore vip ex
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-zd-black">
      <div className="container mx-auto px-hgap-md py-vgap-lg max-w-[1400px]">
        {/* Header */}
        <h1 className="text-3xl font-bold text-white text-center mb-vgap-md">Panels / パネル</h1>

        <ArticleText className="mb-vgap-lg">
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam,
            quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
            consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie
            consequat, vel illum dolore
          </p>
        </ArticleText>

        {/* Acrylic Panels Section */}
        <ArticleH2>アクリル / Acrylic Panels</ArticleH2>

        <ArticleText className="mb-vgap-lg">
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore vip ex ea commodo consequat. Duis
          </p>
        </ArticleText>

        <GridImagesAndNotes items={acrylicPanels} className="mb-vgap-xl" />

        {/* 3D Printed Panels Section */}
        <ArticleH2>3Dプリント / 3D Printed Panels</ArticleH2>

        <ArticleText className="mb-vgap-lg">
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore vip ex ea commodo consequat. Duis
          </p>
        </ArticleText>

        <GridImagesAndNotes items={printedPanels} className="mb-vgap-xl" />
      </div>
    </div>
  );
}
