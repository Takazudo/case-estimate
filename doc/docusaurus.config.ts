import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Case Estimate Documentation',
  tagline: 'Takazudo Modular Case Estimate App Documentation',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://case-estimate.netlify.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/doc/',

  // GitHub pages deployment config.
  organizationName: 'takazudo',
  projectName: 'case-estimate',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Japanese,
  // you may want to replace "en" with "ja".
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja'],
  },

  markdown: {
    mermaid: true,
  },

  themes: [
    '@docusaurus/theme-mermaid',
    [
      // eslint-disable-next-line no-undef
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['ja', 'en'],
        removeDefaultStopWordFilter: true,
        removeDefaultStemmer: true,
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        docsRouteBasePath: '/',
        indexBlog: false,
        indexPages: false,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: undefined, // Disable edit links
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
        },
        blog: false, // Disable blog
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Add noindex meta tag
    metadata: [{ name: 'robots', content: 'noindex, nofollow' }],
    // Dark mode only
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Case Estimate Documentation',
      logo: {
        alt: 'Case Estimate Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Case Estimate. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml'],
    },
    mermaid: {
      theme: { light: 'dark', dark: 'dark' },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
