/**
 * @Author       : Pancake
 * @Date         : 2022-04-05 19:20:15
 * @LastEditTime : 2022-04-10 02:13:40
 * @LastEditors  : Pancake
 * @FilePath     : \Pancake-Q\docs\.vuepress\config.js
 * @Description  : config 文件 - VuePress v2
 */
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
  base: "/",
  title: "Pancake-Q",
  description: "Pancake-Q 知识沉淀",

  // 使用 Vite 打包器
  bundler: viteBundler(),

  theme: defaultTheme({
    navbar: [
      { text: "首页", link: "/" },
      {
        text: "Pancake-Q 的 JavaScript 博客",
        children: [
          { text: "Github", link: "" },
          { text: "掘金", link: "" },
        ],
      },
    ],
  }),
})
