import ArticleH2 from './article/article-h2';
import ArticleParagraph from './article/article-paragraph';
import GridImages from './article/grid-images';

interface TopPageProps {
  onCaseSelect: (caseType: string) => void;
}

export default function TopPage({ onCaseSelect }: TopPageProps) {
  // Temporarily unused - will be used when model links become functional
  void onCaseSelect;
  // Sample data for model grid
  const modelItems = [
    { id: '1', href: '#40-acr-a', caption: '40-ACR-A' },
    { id: '2', href: '#40-acr-b', caption: '40-ACR-B' },
    { id: '3', href: '#40-3dp-a', caption: '40-3DP-A' },
    { id: '4', href: '#40-3dp-b', caption: '40-3DP-B' },
    { id: '5', href: '#40x2-acr-a', caption: '40x2-ACR-A' },
    { id: '6', href: '#40x2-acr-b', caption: '40x2-ACR-B' },
    { id: '7', href: '#40x2-3dp-a', caption: '40x2-3DP-A' },
    { id: '8', href: '#40x2-3dp-b', caption: '40x2-3DP-B' },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto px-hgap-md py-vgap-lg max-w-5xl">
        {/* First paragraph section */}
        <ArticleParagraph className="mb-vgap-lg">
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam,
            quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
            consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie
            consequat, vel illum dolore
          </p>
        </ArticleParagraph>

        {/* Section with heading */}
        <ArticleH2>zudo-block-40</ArticleH2>

        <ArticleParagraph className="mb-vgap-lg">
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore vip ex ea commodo consequat. Duis
          </p>
        </ArticleParagraph>

        {/* Model grid */}
        <GridImages items={modelItems} className="mb-vgap-xl" />
      </div>
    </div>
  );
}
