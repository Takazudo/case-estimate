import ArticleH2 from './article/article-h2';
import ArticleText from './article/article-text';
import { GridImagesAndNotes } from './article/grid-images-and-notes';
import type { GridItem } from './article/grid-images-and-notes';

export default function PanelMaterialPage() {
  // Acrylic Panels data
  const acrylicPanels: GridItem[] = [
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-clear/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-clear/2000w.webp',
      imageAlt: 'クリア（透明）',
      heading: 'クリア（透明）',
      content: (
        <>
          <p>
            透明度の高いアクリル素材。モジュールのLEDや内部構造を美しく見せることができる、最もスタンダードな選択肢です。
          </p>
        </>
      ),
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-forest/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-forest/2000w.webp',
      imageAlt: 'フォレスト',
      heading: 'フォレスト',
      content: (
        <>
          <p>
            深みのある緑色のアクリル。自然を思わせる落ち着いた色合いで、モジュラーシステムにオーガニックな印象を与えます。
          </p>
        </>
      ),
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-glass/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-glass/2000w.webp',
      imageAlt: 'グラス',
      heading: 'グラス',
      content: (
        <>
          <p>
            スモーキーなグレー系の透明アクリル。クリアよりも控えめな印象で、モジュールを程よく隠しながらも透明感を保ちます。
          </p>
        </>
      ),
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-lime/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-lime/2000w.webp',
      imageAlt: 'ライム',
      heading: 'ライム',
      content: (
        <>
          <p>
            鮮やかな黄緑色のアクリル。エネルギッシュで明るい印象を与え、モジュラーシステムに活力をもたらします。
          </p>
        </>
      ),
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-ocean-blue/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-ocean-blue/2000w.webp',
      imageAlt: 'オーシャンブルー',
      heading: 'オーシャンブルー',
      content: (
        <>
          <p>
            深い海の色をイメージした青いアクリル。クールで洗練された印象で、テクノロジカルな雰囲気を演出します。
          </p>
        </>
      ),
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-orange/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-orange/2000w.webp',
      imageAlt: 'オレンジ',
      heading: 'オレンジ',
      content: (
        <>
          <p>
            温かみのあるオレンジ色のアクリル。エネルギッシュで親しみやすい色合いで、創造性を刺激する色彩です。
          </p>
        </>
      ),
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-pink/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-pink/2000w.webp',
      imageAlt: 'ピンク',
      heading: 'ピンク',
      content: (
        <>
          <p>
            優しく華やかなピンク色のアクリル。個性的でありながら上品な印象を与え、ユニークなシステムを演出します。
          </p>
        </>
      ),
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-red/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-red/2000w.webp',
      imageAlt: 'レッド',
      heading: 'レッド',
      content: (
        <>
          <p>
            力強い赤色のアクリル。情熱的でダイナミックな印象を与え、モジュラーシステムに強い個性をもたらします。
          </p>
        </>
      ),
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-shadow/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-shadow/2000w.webp',
      imageAlt: 'シャドウ',
      heading: 'シャドウ',
      content: (
        <>
          <p>
            深いグレー系の半透明アクリル。モダンで洗練された印象を与え、プロフェッショナルな環境に最適です。
          </p>
        </>
      ),
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-sky-blue/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-sky-blue/2000w.webp',
      imageAlt: 'スカイブルー',
      heading: 'スカイブルー',
      content: (
        <>
          <p>
            爽やかな空色のアクリル。清々しく開放的な印象で、リラックスした音楽制作環境を演出します。
          </p>
        </>
      ),
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-yellow/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-yellow/2000w.webp',
      imageAlt: 'イエロー',
      heading: 'イエロー',
      content: (
        <>
          <p>
            明るく鮮やかな黄色のアクリル。ポジティブで創造的な雰囲気を演出し、音楽制作への意欲を高めます。
          </p>
        </>
      ),
    },
  ];

  // 3D Printed Panels data
  const printedPanels: GridItem[] = [
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-black/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-black/2000w.webp',
      imageAlt: 'ブラック',
      heading: 'ブラック',
      content: (
        <>
          <p>
            マットなブラック仕上げの3Dプリントパネル。クラシックで洗練された外観で、どんなモジュールとも相性抜群です。
          </p>
        </>
      ),
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-bone-white/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-bone-white/2000w.webp',
      imageAlt: 'ボーンホワイト',
      heading: 'ボーンホワイト',
      content: (
        <>
          <p>
            温かみのある白色の3Dプリントパネル。純白よりも柔らかい印象で、親しみやすく上品な仕上がりです。
          </p>
        </>
      ),
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-chameleon/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-chameleon/2000w.webp',
      imageAlt: 'カメレオン',
      heading: 'カメレオン',
      content: (
        <>
          <p>
            光の角度により色が変化する特殊な3Dプリントパネル。個性的で未来的な外観が、ユニークなシステムを演出します。
          </p>
        </>
      ),
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-clear-blue/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-clear-blue/2000w.webp',
      imageAlt: 'クリアブルー',
      heading: 'クリアブルー',
      content: (
        <>
          <p>半透明の青い3Dプリントパネル。LEDの光を美しく拡散し、幻想的な雰囲気を演出します。</p>
        </>
      ),
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-clear-red/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-clear-red/2000w.webp',
      imageAlt: 'クリアレッド',
      heading: 'クリアレッド',
      content: (
        <>
          <p>
            半透明の赤い3Dプリントパネル。情熱的で温かみのある光を放ち、ダイナミックな印象を与えます。
          </p>
        </>
      ),
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-crymson-red/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-crymson-red/2000w.webp',
      imageAlt: 'クリムゾンレッド',
      heading: 'クリムゾンレッド',
      content: (
        <>
          <p>
            深い赤色の3Dプリントパネル。力強く洗練された色合いで、プロフェッショナルな印象を演出します。
          </p>
        </>
      ),
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-dark-orange/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-dark-orange/2000w.webp',
      imageAlt: 'ダークオレンジ',
      heading: 'ダークオレンジ',
      content: (
        <>
          <p>
            落ち着いたオレンジ色の3Dプリントパネル。温かみがありながら上品で、創造的な音楽制作をサポートします。
          </p>
        </>
      ),
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-deep-yellow/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-deep-yellow/2000w.webp',
      imageAlt: 'ディープイエロー',
      heading: 'ディープイエロー',
      content: (
        <>
          <p>
            深みのある黄色の3Dプリントパネル。明るすぎず落ち着いた印象で、長時間の使用でも目に優しい色合いです。
          </p>
        </>
      ),
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-gold-yellow/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-gold-yellow/2000w.webp',
      imageAlt: 'ゴールドイエロー',
      heading: 'ゴールドイエロー',
      content: (
        <>
          <p>
            金色を思わせる黄色の3Dプリントパネル。高級感のある輝きで、特別なモジュラーシステムを演出します。
          </p>
        </>
      ),
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-light-orange/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-light-orange/2000w.webp',
      imageAlt: 'ライトオレンジ',
      heading: 'ライトオレンジ',
      content: (
        <>
          <p>
            明るく親しみやすいオレンジ色の3Dプリントパネル。ポップで楽しい印象を与え、創造性を刺激します。
          </p>
        </>
      ),
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-wood-white/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-wood-white/2000w.webp',
      imageAlt: 'ウッドホワイト',
      heading: 'ウッドホワイト',
      content: (
        <>
          <p>
            木目調の白い3Dプリントパネル。自然な質感と温かみのある色合いで、オーガニックな音楽制作環境を演出します。
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
