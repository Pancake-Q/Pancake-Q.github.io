<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePageData } from 'vuepress/client'

const page = usePageData()

onMounted(() => {
  // 在 VuePress v2 中，可以使用 lastUpdated 插件或者在 frontmatter 中设置
  // 这里仅作为示例，实际使用中建议使用插件
  console.log('Page mounted:', page.value.path)
})
</script>