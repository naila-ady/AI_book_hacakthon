import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'PHYSICAL AI & HUMANOID ROBOTICS',
  tagline: 'DEEP DIVE INTO THE WORLD OF PHYSICAL AI & HUMANOID ROBOTICS',
  favicon: 'img/logo.jpg',

  future: {
    v4: true,
  },

  url: 'https://book-hacakthon-ec4syqhp6-nailaadys-projects.vercel.app', // Your current Vercel deployment URL
  baseUrl: '/',

  organizationName: 'naila-ady',
  projectName: 'AI_book_hacakthon',

  trailingSlash: false,

  onBrokenLinks: 'ignore',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/naila-ady/AI_book_hackathon/edit/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts:'ignore',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    // Add proxy configuration for development
    () => ({
      name: 'api-proxy',
      configureWebpack: () => ({
        devServer: {
          proxy: [
            {
              context: ['/api'],
              target: process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:8000',
              changeOrigin: true,
              secure: false,
            },
          ],
        },
      }),
    }),
  ],

  themeConfig: {
    image: 'img/logo.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'AI Humanoid Book',
      logo: {
        alt: 'AI logo',
        src: 'img/logo.jpg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'CHAPTERS',
        },
        {to: '/blog', label: 'BOOK OVERVIEW', position: 'left'},
        {
          href: 'https://naila-ady.github.io/AI_book_hacakthon/',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'X',
              href: 'https://x.com/docusaurus',
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
              href: 'https://github.com/naila-ady/AI_book_hacakthon.git',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My First AI Book. @Naila Adnan`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
