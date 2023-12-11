import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TransformDynamicLFFileImportToStatic } from './src/remark/TransformDynamicLFFileImportToStatic';
import redirects from "./docs/legacy_routing";

const config: Config = {
  title: 'Lingua Franca',
  tagline: 'The system design language',
  favicon: 'img/favicon.png',

  // Set the production url of your site here
  url: 'https://www.lf-lang.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'lf-lang', // Usually your GitHub org/user name.
  projectName: 'lingua-franca', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './docs/sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/axmmisaka/lf-docs-docusaurus/tree/master/docs/',
          beforeDefaultRemarkPlugins: [
            // Honestly, I recommend not using this because I am not confident with my coding skill......
            // TransformDynamicLFFileImportToStatic
          ],
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      logo: {
        alt: 'The Lingua Franca Logo',
        src: 'img/lf-forlight.svg',
        srcDark: "img/lf-fordark.svg",
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'handbookSidebar',
          position: 'left',
          label: 'Handbook',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {to: '/research', label: 'Research', position: 'left'},
        {to: '/community', label: 'Community', position: 'left'},
        {
          href: 'https://github.com/lf-lang/',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'Zulip',
              href: 'https://zulip.lf-lang.org',
            },
            {
              label: 'Reddit',
              href: 'https://reddit.com/r/thelflang',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/lf-lang',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} The Lingua Franca project. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  plugins: [
    ['@docusaurus/plugin-ideal-image', {}],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: redirects,
        // We don't use createRedirects because directory structure has changed.
      },
    ],
    () => ({
      name: 'read-lf-source-code-files',
      configureWebpack: () => ({
        module: {
          rules: [
            {
              // Any LF file that lies in path where some directory is named "codes"
              test: /codes?\/.*\.lf$/,
              type: "asset/source",
            },
          ],
        },
      })
    }),
  ],

  

  clientModules: [
    "src/components/ShikijiLFHighlighter/shikijiloader.ts"
  ],
};

export default config;
