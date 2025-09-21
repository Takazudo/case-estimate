'use client';

import ArticleH2 from './article/article-h2';
import ArticleText from './article/article-text';
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
    {
      id: '1',
      caseId: 'zudo-block-40-ACR-A',
      caption: 'zudo-block-40-ACR-A',
      imgSrc: 'https://takazudomodular.com/images/p/panel-thumb-acr-zb40-a/900w.webp',
    },
    {
      id: '2',
      caseId: 'zudo-block-40-ACR-B',
      caption: 'zudo-block-40-ACR-B',
      imgSrc: 'https://takazudomodular.com/images/p/panel-thumb-acr-zb40-b/900w.webp',
    },
    {
      id: '3',
      caseId: 'zudo-block-40-3DP-A',
      caption: 'zudo-block-40-3DP-A',
      imgSrc: 'https://takazudomodular.com/images/p/panel-thumb-3dp-zb40-a/900w.webp',
    },
    {
      id: '4',
      caseId: 'zudo-block-40-3DP-B',
      caption: 'zudo-block-40-3DP-B',
      imgSrc: 'https://takazudomodular.com/images/p/panel-thumb-3dp-zb40-b/900w.webp',
    },
    {
      id: '5',
      caseId: 'zudo-block-40x2-ACR-A',
      caption: 'zudo-block-40x2-ACR-A',
      imgSrc: 'https://takazudomodular.com/images/p/panel-thumb-acr-zb40x2-a/900w.webp',
    },
    {
      id: '6',
      caseId: 'zudo-block-40x2-ACR-B',
      caption: 'zudo-block-40x2-ACR-B',
      imgSrc: 'https://takazudomodular.com/images/p/panel-thumb-acr-zb40x2-b/900w.webp',
    },
    {
      id: '7',
      caseId: 'zudo-block-40x2-3DP-A',
      caption: 'zudo-block-40x2-3DP-A',
      imgSrc: 'https://takazudomodular.com/images/p/panel-thumb-3dp-zb40x2-a/900w.webp',
    },
    {
      id: '8',
      caseId: 'zudo-block-40x2-3DP-B',
      caption: 'zudo-block-40x2-3DP-B',
      imgSrc: 'https://takazudomodular.com/images/p/panel-thumb-3dp-zb40x2-b/900w.webp',
    },
  ];

  // zudo-block-60 models
  const zudoBlock60Items = [
    {
      id: '9',
      caseId: 'zudo-block-60-ACR-A',
      caption: 'zudo-block-60-ACR-A',
      imgSrc: 'https://takazudomodular.com/images/p/panel-thumb-acr-zb60-a/900w.webp',
    },
    {
      id: '10',
      caseId: 'zudo-block-60-ACR-B',
      caption: 'zudo-block-60-ACR-B',
      imgSrc: 'https://takazudomodular.com/images/p/panel-thumb-acr-zb60-b/900w.webp',
    },
    {
      id: '11',
      caseId: 'zudo-block-60-3DP-A',
      caption: 'zudo-block-60-3DP-A',
      imgSrc: 'https://takazudomodular.com/images/p/panel-thumb-3dp-zb60-a/900w.webp',
    },
    {
      id: '12',
      caseId: 'zudo-block-60-3DP-B',
      caption: 'zudo-block-60-3DP-B',
      imgSrc: 'https://takazudomodular.com/images/p/panel-thumb-3dp-zb60-b/900w.webp',
    },
    {
      id: '13',
      caseId: 'zudo-block-60x2-ACR-A',
      caption: 'zudo-block-60x2-ACR-A',
      imgSrc: 'https://takazudomodular.com/images/p/panel-thumb-acr-zb60x2-a/900w.webp',
    },
    {
      id: '14',
      caseId: 'zudo-block-60x2-ACR-B',
      caption: 'zudo-block-60x2-ACR-B',
      imgSrc: 'https://takazudomodular.com/images/p/panel-thumb-acr-zb60x2-b/900w.webp',
    },
    {
      id: '15',
      caseId: 'zudo-block-60x2-3DP-A',
      caption: 'zudo-block-60x2-3DP-A',
      imgSrc: 'https://takazudomodular.com/images/p/panel-thumb-3dp-zb60x2-a/900w.webp',
    },
    {
      id: '16',
      caseId: 'zudo-block-60x2-3DP-B',
      caption: 'zudo-block-60x2-3DP-B',
      imgSrc: 'https://takazudomodular.com/images/p/panel-thumb-3dp-zb60x2-b/900w.webp',
    },
  ];

  // 10BOX models
  const tenBoxItems = [
    {
      id: '17',
      caseId: '10box-3dp',
      caption: '10BOX-3DP',
      imgSrc: 'https://takazudomodular.com/images/p/panel-thumb-3dp-10box-lite/900w.webp',
    },
  ];

  return (
    <div className="h-full flex flex-col bg-zd-black">
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-hgap-md py-vgap-lg max-w-[1400px]">
          <ArticleText className="mb-vgap-lg">
            <p>
              Takazudo Modular Panelsは、Takazudo
              Modularのケースオーダー用Webアプリです。ケースのモデルをまず選び、パネル毎に好きな色んで、オリジナルのケースをデザインできます。
            </p>
          </ArticleText>

          <ArticleH2>zudo-block-40</ArticleH2>

          <ArticleText>
            <p>
              zudo-block-40は、40HPのコンパクトなユーロラックモジュラーシンセ向けケース。レールのフレーム部分を好きに傾けて固定することで、自分好みのセットアップを実現可能。二つ繋げて3U+3U+1Uレールを備えたミニタワー型、40x2タイプも選択可能です。
            </p>
          </ArticleText>

          <GridImages
            items={zudoBlock40Items}
            onItemClick={handleModelClick}
            className="mb-vgap-xl"
          />

          <ArticleH2>zudo-block-60</ArticleH2>

          <ArticleText>
            <p>
              zudo-block-60は、60HPの丁度良いサイズのケース。基本的な機能は40HPタイプと同じで、2つ繋げた60x2タイプは、中規模のシステムに丁度良いサイズのケースです。
            </p>
          </ArticleText>

          <GridImages
            items={zudoBlock60Items}
            onItemClick={handleModelClick}
            className="mb-vgap-xl"
          />

          <ArticleH2>10BOX Ju-Bako</ArticleH2>

          <ArticleText>
            <p>
              10BOX
              Ju-Bakoは、幅60HP、浅い前側、深い奥側の2レール構成の、固定レイアウトタイプのケース。深さの違いを利用したスタンドや、ホコリ避け用のケースも付属した、卓上に丁度良いサイズのケースです。
            </p>
          </ArticleText>

          <GridImages items={tenBoxItems} onItemClick={handleModelClick} className="mb-vgap-xl" />
        </div>
      </div>
    </div>
  );
}
