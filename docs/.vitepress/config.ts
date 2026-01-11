import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'React Scanner UI',
  description: 'A React component scanner and visualization tool',
  base: '/react-scanner-ui/',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/' },
          { text: 'Installation', link: '/guide/installation' },
          { text: 'Usage', link: '/guide/usage' },
        ],
      },
      {
        text: 'API Reference',
        items: [{ text: 'API Overview', link: '/api/' }],
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/vimalmunjani/react-scanner-ui',
      },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 Vimal Munjani',
    },
  },

  head: [['link', { rel: 'icon', href: '/react-scanner-ui/favicon.ico' }]],
});
