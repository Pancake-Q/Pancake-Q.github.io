// .vitepress/theme/index.ts
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import GiscusComment from './components/GiscusComment.vue'
import ReadingInfo from './components/ReadingInfo.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(ReadingInfo),
      'doc-after': () => h(GiscusComment)
    })
  },
  enhanceApp() {
    // Custom components can be registered here
  }
} satisfies Theme