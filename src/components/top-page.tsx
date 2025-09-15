import ArticleH2 from './article/article-h2';
import ArticleParagraph from './article/article-paragraph';
import GridImages from './article/grid-images';

interface TopPageProps {
  onCaseSelect: (caseType: string) => void;
}

export default function TopPage({ onCaseSelect }: TopPageProps) {
  // Handle model link clicks
  const handleModelClick = (caseId: string) => {
    onCaseSelect(caseId);
  };

  // zudo-block-40 models
  const zudoBlock40Items = [
    { id: '1', caseId: 'zudo-block-40-ACR-A', caption: 'zudo-block-40-ACR-A' },
    { id: '2', caseId: 'zudo-block-40-ACR-B', caption: 'zudo-block-40-ACR-B' },
    { id: '3', caseId: 'zudo-block-40-3DP-A', caption: 'zudo-block-40-3DP-A' },
    { id: '4', caseId: 'zudo-block-40-3DP-B', caption: 'zudo-block-40-3DP-B' },
    { id: '5', caseId: 'zudo-block-40x2-ACR-A', caption: 'zudo-block-40x2-ACR-A' },
    { id: '6', caseId: 'zudo-block-40x2-ACR-B', caption: 'zudo-block-40x2-ACR-B' },
    { id: '7', caseId: 'zudo-block-40x2-3DP-A', caption: 'zudo-block-40x2-3DP-A' },
    { id: '8', caseId: 'zudo-block-40x2-3DP-B', caption: 'zudo-block-40x2-3DP-B' },
  ];

  // zudo-block-60 models
  const zudoBlock60Items = [
    { id: '9', caseId: 'zudo-block-60-ACR-A', caption: 'zudo-block-60-ACR-A' },
    { id: '10', caseId: 'zudo-block-60-ACR-B', caption: 'zudo-block-60-ACR-B' },
    { id: '11', caseId: 'zudo-block-60-3DP-A', caption: 'zudo-block-60-3DP-A' },
    { id: '12', caseId: 'zudo-block-60-3DP-B', caption: 'zudo-block-60-3DP-B' },
    { id: '13', caseId: 'zudo-block-60x2-ACR-A', caption: 'zudo-block-60x2-ACR-A' },
    { id: '14', caseId: 'zudo-block-60x2-ACR-B', caption: 'zudo-block-60x2-ACR-B' },
    { id: '15', caseId: 'zudo-block-60x2-3DP-A', caption: 'zudo-block-60x2-3DP-A' },
    { id: '16', caseId: 'zudo-block-60x2-3DP-B', caption: 'zudo-block-60x2-3DP-B' },
  ];

  // 10BOX models
  const tenBoxItems = [{ id: '17', caseId: '10box-lite', caption: '10BOX Lite' }];

  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto px-hgap-md py-vgap-lg max-w-5xl">
        <ArticleParagraph className="mb-vgap-lg">
          <p>
            Takazudo Modular Panelsは、Takazudo
            Modularのケースオーダー用Webアプリです。ケースのモデルをまず選び、パネル毎に好きな色んで、オリジナルのケースをデザインできます。
          </p>
        </ArticleParagraph>

        <ArticleH2>zudo-block-40</ArticleH2>

        <ArticleParagraph className="mb-vgap-lg">
          <p>
            zudo-block-40は、40HPのコンパクトなユーロラックモジュラーシンセ向けケース。レールのフレーム部分を好きに傾けて固定することで、自分好みのセットアップを実現可能。二つ繋げて3U+3U+1Uレールを備えたミニタワー型、40x2タイプも選択可能です。
          </p>
        </ArticleParagraph>

        <GridImages
          items={zudoBlock40Items}
          onItemClick={handleModelClick}
          className="mb-vgap-xl"
        />

        <ArticleH2>zudo-block-60</ArticleH2>

        <ArticleParagraph className="mb-vgap-lg">
          <p>
            zudo-block-60は、60HPの丁度良いサイズのケース。基本的な機能は40HPタイプと同じで、2つ繋げた60x2タイプは、中規模のシステムに丁度良いサイズのケースです。
          </p>
        </ArticleParagraph>

        <GridImages
          items={zudoBlock60Items}
          onItemClick={handleModelClick}
          className="mb-vgap-xl"
        />

        <ArticleH2>10BOX Ju-Bako</ArticleH2>

        <ArticleParagraph className="mb-vgap-lg">
          <p>
            10BOX
            Ju-Bakoは、幅60HP、浅い前側、深い奥側の2レール構成の、固定レイアウトタイプのケース。深さの違いを利用したスタンドや、ホコリ避け用のケースも付属した、卓上に丁度良いサイズのケースです。
          </p>
        </ArticleParagraph>

        <GridImages items={tenBoxItems} onItemClick={handleModelClick} className="mb-vgap-xl" />
      </div>
    </div>
  );
}
