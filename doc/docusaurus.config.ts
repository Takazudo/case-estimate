import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Takazudo Modular: Panels Documentation',
  tagline: 'Technical documentation and development notes',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://panels.takazudomodular.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/doc/',

  // Don't add trailing slash
  trailingSlash: false,

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang.
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja'],
  },

  // Add noindex meta tag to prevent search engine indexing
  noIndex: true,

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          // Disable edit links since this is private documentation
          editUrl: undefined,
          // Show last update time and author from git history
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          // Add remark plugin to inject creation dates
          beforeDefaultRemarkPlugins: [[require('./plugins/remark-creation-date.js'), {}]],
        },
        // Disable blog feature
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        language: ['ja'],
        hashed: true,
        highlightSearchTermsOnTargetPage: true,
        docsRouteBasePath: '/',
        // Disable indexing for search engines
        indexDocs: true,
        indexBlog: false,
        indexPages: true,
      },
    ],
  ],

  themeConfig: {
    // Force dark mode and disable theme switching
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    // Add meta tags for SEO protection
    metadata: [
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'googlebot', content: 'noindex, nofollow' },
    ],
    navbar: {
      title: 'Case Estimate Docs',
      logo: {
        alt: 'Case Estimate Logo',
        src: 'img/logo.svg',
        width: 32,
        height: 32,
      },
      items: [
        {
          type: 'doc',
          docId: 'inbox/index',
          position: 'left',
          label: 'INBOX',
        },
        {
          type: 'doc',
          docId: 'builder/index',
          position: 'left',
          label: 'Builder',
        },
        {
          type: 'doc',
          docId: 'knowledge/index',
          position: 'left',
          label: 'Knowledge',
        },
        {
          href: 'https://case-estimate.netlify.app',
          label: 'Main Site',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Case Estimate. Documentation built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.oneDark,
    },
    // Code block settings
    codeblock: {
      showLineNumbers: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
