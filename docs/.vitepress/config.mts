import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // Site metadata
  title: "个人技术博客",
  description: "分享前端、后端、工具使用等技术文章",
  lang: 'zh-CN',

  // GitHub Pages base path
  base: '/',

  // Sitemap for SEO
  sitemap: {
    hostname: 'https://pancake-q.github.io'
  },

  // Clean URLs (remove .html)
  cleanUrls: true,

  // Last updated timestamp
  lastUpdated: true,

  // Head tags for SEO and favicons
  head: [
    ['link', { rel: 'icon', type: 'image/gif', href: '/logo.gif' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:site_name', content: '个人技术博客' }],
  ],

  // Markdown configuration
  markdown: {
    lineNumbers: true,
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    }
  },

  // Theme configuration
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    // Logo
    logo: '/logo.gif',

    // Navigation
    nav: [
      { text: '首页', link: '/' },
      { text: '博客', link: '/blog/' },
      {
        text: '分类',
        items: [
          { text: '前端', link: '/categories/frontend/' },
          { text: '后端', link: '/categories/backend/' },
          { text: '工具', link: '/categories/tools/' }
        ]
      },
      { text: '标签', link: '/tags/' },
      { text: '归档', link: '/archives/' },
      { text: '关于', link: '/about' }
    ],

    // Sidebar
    sidebar: {
      '/blog/': [
        {
          text: '最新文章',
          collapsed: false,
          items: [
            { text: '欢迎来到我的博客', link: '/blog/welcome' }
          ]
        },
        {
          text: '示例',
          collapsed: false,
          items: [
            { text: 'Markdown 示例', link: '/markdown-examples' },
            { text: 'Runtime API 示例', link: '/api-examples' }
          ]
        }
      ],
      '/categories/frontend/': [
        {
          text: '前端开发',
          items: []
        }
      ],
      '/categories/backend/': [
        {
          text: '后端开发',
          items: []
        }
      ],
      '/categories/tools/': [
        {
          text: '工具使用',
          items: []
        }
      ]
    },

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Pancake-Q/Pancake-Q.github.io' }
    ],

    // Edit link
    editLink: {
      pattern: 'https://github.com/Pancake-Q/Pancake-Q.github.io/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    // Footer
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present PancakeHub'
    },

    // Document footer navigation
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    // Outline
    outline: {
      level: [2, 3],
      label: '目录'
    },

    // Last updated text
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    },

    // Return to top label
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    // Search (local search)
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    }
  }
})
