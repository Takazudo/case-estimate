'use client';

import ArticleH2 from './article/article-h2';
import ArticleText from './article/article-text';
import { ArticleGridImageList } from './article/article-grid-image-list';
import type { GridImageItem } from './article/article-grid-image-list';

export default function PanelMaterialPage() {
  // Acrylic Panels data
  const acrylicPanels: GridImageItem[] = [
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-clear/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-clear/2000w.webp',
      imageAlt: 'クリア（透明）',
      heading: 'クリア',
      subHeading: 'Transparent',
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-glass/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-glass/2000w.webp',
      imageAlt: 'グラス',
      heading: 'ガラスシアン',
      subHeading: 'Glass Cyan',
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-forest/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-forest/2000w.webp',
      imageAlt: 'フォレスト',
      heading: 'フォレスト',
      subHeading: 'Deep Green',
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-lime/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-lime/2000w.webp',
      imageAlt: 'ライム',
      heading: 'ライム',
      subHeading: 'Light Green',
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-ocean-blue/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-ocean-blue/2000w.webp',
      imageAlt: 'オーシャンブルー',
      heading: 'オーシャンブルー',
      subHeading: 'Deep Blue',
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-orange/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-orange/2000w.webp',
      imageAlt: 'オレンジ',
      heading: 'オレンジ',
      subHeading: 'Orange',
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-pink/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-pink/2000w.webp',
      imageAlt: 'ピンク',
      heading: 'ピンク',
      subHeading: 'Pink',
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-red/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-red/2000w.webp',
      imageAlt: 'レッド',
      heading: 'レッド',
      subHeading: 'Red',
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-shadow/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-shadow/2000w.webp',
      imageAlt: 'シャドウ',
      heading: 'シャドー',
      subHeading: 'Gray',
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-sky-blue/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-sky-blue/2000w.webp',
      imageAlt: 'スカイブルー',
      heading: 'スカイブルー',
      subHeading: 'Light Blue',
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-yellow/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-yellow/2000w.webp',
      imageAlt: 'イエロー',
      heading: 'イエロー',
      subHeading: 'Yellow',
    },
  ];

  // 3D Printed Panels data
  const printedPanels: GridImageItem[] = [
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-black/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-black/2000w.webp',
      imageAlt: 'ブラック',
      heading: 'カーボンブラック',
      subHeading: 'PLA-CF',
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-bone-white/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-bone-white/2000w.webp',
      imageAlt: 'ボーンホワイト',
      heading: 'ボーンホワイト',
      subHeading: 'PLA',
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-chameleon/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-chameleon/2000w.webp',
      imageAlt: 'カメレオン',
      heading: 'カメレオン',
      subHeading: 'Special',
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-clear-blue/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-clear-blue/2000w.webp',
      imageAlt: 'クリアブルー',
      heading: 'クリアブルー',
      subHeading: 'PETG',
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-clear-red/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-clear-red/2000w.webp',
      imageAlt: 'クリアレッド',
      heading: 'クリアレッド',
      subHeading: 'PETG',
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-crymson-red/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-crymson-red/2000w.webp',
      imageAlt: 'クリムゾンレッド',
      heading: 'クリムゾンレッド',
      subHeading: 'PLA',
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-dark-orange/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-dark-orange/2000w.webp',
      imageAlt: 'ダークオレンジ',
      heading: 'ダークオレンジ',
      subHeading: 'PLA',
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-deep-yellow/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-deep-yellow/2000w.webp',
      imageAlt: 'ディープイエロー',
      heading: 'ディープイエロー',
      subHeading: 'PLA',
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-gold-yellow/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-gold-yellow/2000w.webp',
      imageAlt: 'ゴールドイエロー',
      heading: 'ゴールドイエロー',
      subHeading: 'PLA',
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-light-orange/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-light-orange/2000w.webp',
      imageAlt: 'ライトオレンジ',
      heading: 'ライトオレンジ',
      subHeading: 'PLA',
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-wood-white/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-wood-white/2000w.webp',
      imageAlt: 'ウッドホワイト',
      heading: 'ウッドホワイト',
      subHeading: 'PLA',
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

        <ArticleText>
          <p>
            透明度のあるアクリルは、他のケースには無い質感をモジュラーシステムにもたらしてくれます。質感や色が限定されてしまう一般的なケースと比較すると、アクリルはその軽量性と多彩なカラーリングが魅力と言えるでしょう。
          </p>
          <p>
            システム全体を軽やかに見せつつ、選んだカラーによって印象を自在にコントロールできます。強い衝撃を受けると割れやすい素材ではあるため、持ち運び時にはやや注意が必要ですが、モジュラー背面の基盤やLEDを反射して美しく見せる特徴は唯一無二で、使っていて楽しく、無機質になりがちなセットアップを彩ります。
          </p>
        </ArticleText>

        <ArticleGridImageList items={acrylicPanels} className="mb-vgap-xl" />

        {/* 3D Printed Panels Section */}
        <ArticleH2>3Dプリント / 3D Printed Panels</ArticleH2>

        <ArticleText>
          <p>
            樹脂を積み重ねて成形する3Dプリントパネルは、積層造形による独特のテクスチャが特徴的です。素材や色も豊富で、マットな風合いからポップで明るい色、半透明の素材まで、多彩な選択肢を自由に組み合わせて楽しむことが出来ます。
          </p>
          <p>
            元々このケースシリーズは、アクリルケースを作るのが当初の目標であり、その設計に3Dプリンタを使っていました。しかしながら、3Dプリントを繰り返していくとその素材感が割と良く、組み合わせの楽しさから、製品ラインナップに加えることとしました。
          </p>
        </ArticleText>

        <ArticleGridImageList items={printedPanels} className="mb-vgap-xl" />

        <ArticleH2>素材に関するうんちく</ArticleH2>

        <ArticleText>
          <p>
            パネルを選ぶ際、それぞれの質感や特徴について理解して頂けると、より楽しくケースが作れるかと思いますので、素材についてのうんちくをここにまとめさせた頂きます。
          </p>
          <p>
            まずアクリルですが、これは硬く、強い衝撃で割れやすい素材です。モジュラーシンセのケースであるという特徴上、中にモジュラーを詰め込むことになります。そうすると、それなりの重さになりますかr、この状態で例えば50cmぐらいの高さから落としてしまうと、1箇所に加重がかかり、端が欠けます。ほか、例えばリュックなどに入れて、コンクリートの道路の上でガンと置くと、おそらくこれでも割れます。金属や木材製のケースと比較した場合、これはまず一つデメリットです。長くお使いいただくために、まずこの点をご認識のうえ、ご利用頂けますと幸いです。
          </p>
          <p>
            しかし、中が透けて見えたり、LEDがアクリルボードの断面で反射する様子は、他には無い特徴です。これは作った後に気付いたのですが、例えばライムのパネルは、青色の光を反射しやすい特徴があるようで、暗めの環境では蛍光色のような発色をします。ほか、グラスシアンというのは、ガラスの質感を模して作られた色合いであるようです。昨今はモジュラー演奏のショート動画を撮ってSNSでアップしたりすることが多いかと思いますが、ケース自体がアクリルだと結構映える感じします。取り立てて特に持ち運んだりする予定もそこまで無い場合、インテリア的にも楽しいケースになるのでオススメしたいですね。
          </p>
          <p>
            次に3Dプリントのパネルですが、これはつまりプラスチック製です。この3Dプリンター製のパネルですが、FDM（溶融堆積造形）といって、例えば0.3mmぐらいの高さで、フィラメントと呼ばれる細長い糸状プラスチックを溶かしながら層を作り、それを造形物の高さまで積み重ねるという方式で作られています。定型のものを大量生産しているわけでは無く、一つ一つ時間をかけて手作りに近い様な工程で作られているため、パネル毎に多少のバラツキがあることについてご留意ください。このプリントにも色々コツがあり、プリント品質の低いものは破棄しているので、何か曲がったり、あからさまに崩れている様なものは届きませんので、その点はご安心ください。
          </p>
          <p>
            3Dプリントのパネルについて、プラスチックだと結構安っぽくなるかと感じられる人もいらっしゃるのではと思いますが、ご購入頂いた方からは、思ったよりもずっとしっかりしているという感想をよく頂いています。ただし、安っぽい感じにならないよう、以下の素材の特徴をご理解頂いた上、パネルを選んで頂けると良いでしょう。
          </p>
          <p>
            まず一つ、オススメしたいのがPLA-CFのカーボンブラックです。PLAというのは3Dプリンタで広く使われている、プリントしやすい素材。そこにカーボンファイバーを混ぜたのがPLA-CFです。前述しましたが、元々3Dプリントしたケースを販売する予定はありませんでした。安っぽい気がするし、プラスチックだしなと思っていたのです。ですが、このPLA-CFの質感はかなり良く、これなら販売に耐えうる品質になると考えました。マットで落ち着いた感じの素材で、なおかつ強度があります。こういうカーボンファイバー入り素材が使われるのは、主に強度のためです。検証したわけではありませんが、落としてもアクリルボードよりもずっと割れづらい素材です。色としても黒がベースだと締まるので、カーボンブラックを主にして、アクセントカラーを混ぜる構成をオススメしたいです。
          </p>
          <p>
            その他の素材として、バリエーションに多く使用しているのがPLA。これはとてもプリントしやすい素材です。仕上がりとしては、前述PLA-CFと比較すると、マットさは減り、プラスチック感はまぁまぁする素材であると言えます。ただ、3Dプリントの素材の中ではダントツにカラーバリエーションがある素材で、色々プリントしているだけでも割と楽しいものです。カスタムのケースは自分の好きなカラーや素材を組み合わせられることであると考えており、お好きな色を選んで構成して頂けると良いと考えています。
          </p>
          <p>
            PETGは、ペットボトルで使われるPETという素材を改質した素材、ある程度の弾性があり、柔らかめで衝撃に強いという特性があります。透明やラメ入りのフィラメントもあり、独特のバリエーションがあります。ただ、FDM方式のプリントだと、アクリルのようなクリアさを出すのはかなり難しく、基本的には濁った感じの半透明さを楽しんでいただくと良いかと考えています。
          </p>
          <p>
            3Dプリントのパネルについては、私の方でプリントし、これは良さそうというものをラインアップとして載せています。是非、ご自身の好きなカラーで自分だけのケースを楽しんでいただければと思います。
          </p>
        </ArticleText>
      </div>
    </div>
  );
}
