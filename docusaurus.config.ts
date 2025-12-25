import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import path from 'path';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'NEU CS 3100 Public Resources',
  tagline: 'Resources for CS 3100 (Public)',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://neu-pdi.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/cs3100-public-resources/',

  // GitHub pages deployment config.
  organizationName: 'neu-pdi', // Usually your GitHub org/user name.
  projectName: 'cs3100-public-resources', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    [path.resolve(__dirname, './plugins/classasaurus/index.ts'), {
      configPath: './course.config.json',
      generateSchedule: true,
      scheduleRoute: '/schedule',
      validateLectureFiles: false, // Enable after all lectures are mapped
    }],
    [path.resolve(__dirname, './plugins/staff-images/index.ts'), {
      sourceDir: 'static/img/staff',
      outputDir: 'img/staff',
      size: 300,
      quality: 85,
      generateWebP: true,
    }],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'labs',
        path: 'labs',
        routeBasePath: 'labs',
        editUrl: 'https://github.com/neu-pdi/cs3100-public-resources/edit/main/',
        sidebarPath: './sidebars.ts',
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'assignments',
        path: 'assignments',
        routeBasePath: 'assignments',
        editUrl: 'https://github.com/neu-pdi/cs3100-public-resources/edit/main/',
        sidebarPath: './sidebars.ts',
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'lecture-slides',
        path: 'lecture-slides',
        routeBasePath: 'lecture-slides',
        editUrl: 'https://github.com/neu-pdi/cs3100-public-resources/edit/main/',
        sidebarPath: './sidebars.ts',
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      },
    ],
    function(context, options) {
      return {
        name: 'webpack-alias-plugin',
        configureWebpack(config, isServer) {
          return {
            resolve: {
              alias: {
                '@': require('path').resolve(__dirname, 'src'),
                'next/navigation': require('path').resolve(__dirname, 'src/hooks/next-navigation'),
              },
            },
          };
        },
      };
    },
  ],


  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'lecture-notes',
          routeBasePath: 'lecture-notes',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/neu-pdi/cs3100-public-resources/edit/main/',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/qwan-social-card.png',
    navbar: {
      title: 'CS 3100 Public Resources',
      logo: {
        alt: 'Pawtograder Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/syllabus',
          position: 'left',
          label: 'Syllabus',
        },
        {
          to: '/schedule',
          position: 'left',
          label: 'Schedule',
        },
        {
          type: 'docSidebar',
          sidebarId: 'lectureNotesSidebar',
          position: 'left',
          label: 'Lecture Notes',
        },
        {
          type: 'docSidebar',
          sidebarId: 'labsSidebar',
          docsPluginId: 'labs',
          position: 'left',
          label: 'Labs',
        },
        {
          type: 'docSidebar',
          sidebarId: 'assignmentsSidebar',
          docsPluginId: 'assignments',
          position: 'left',
          label: 'Assignments',
        },
        {
          type: 'docSidebar',
          sidebarId: 'lectureSlidesSidebar',
          docsPluginId: 'lecture-slides',
          position: 'left',
          label: 'Lecture Slides',
        },
        {
          to: '/staff',
          position: 'left',
          label: 'Staff',
        }
      ],
    },
    footer: {
      style: 'dark',
      // links: [
      //   {
      //     title: 'Docs',
      //     items: [
      //       {
      //         label: 'Tutorial',
      //         to: '/docs/intro',
      //       },
      //     ],
      //   },
      //   {
      //     title: 'Community',
      //     items: [
      //       {
      //         label: 'Stack Overflow',
      //         href: 'https://stackoverflow.com/questions/tagged/docusaurus',
      //       },
      //       {
      //         label: 'Discord',
      //         href: 'https://discordapp.com/invite/docusaurus',
      //       },
      //       {
      //         label: 'X',
      //         href: 'https://x.com/docusaurus',
      //       },
      //     ],
      //   },
      //   {
      //     title: 'More',
      //     items: [
      //       {
      //         label: 'Blog',
      //         to: '/blog',
      //       },
      //       {
      //         label: 'GitHub',
      //         href: 'https://github.com/facebook/docusaurus',
      //       },
      //     ],
      //   },
      // ],
      copyright: `Copyright © ${new Date().getFullYear()} Jonathan Bell and contributors, Licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en">CC-BY-NC-SA 4.0</a>`,
    },
    colorMode: {
      respectPrefersColorScheme: true,
    },
    prism: {
      additionalLanguages: ['java'],
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
  future: {
    experimental_storage: {
      type: 'localStorage',
      namespace: true,
    },
  },
};

export default config;
