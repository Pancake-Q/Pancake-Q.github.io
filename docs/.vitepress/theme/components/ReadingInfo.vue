<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { page } = useData()

const wordCount = computed(() => {
  const content = page.value.content || ''
  // Remove code blocks and HTML tags
  const text = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[#*`~\[\]()]/g, '')

  // Count Chinese characters and English words
  const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const english = (text.match(/[a-zA-Z]+/g) || []).length
  return chinese + english
})

const readingTime = computed(() => {
  // Average reading speed: 300 Chinese chars or 200 English words per minute
  const minutes = Math.ceil(wordCount.value / 300)
  return minutes < 1 ? 1 : minutes
})
</script>

<template>
  <div class="reading-info" v-if="wordCount > 0">
    <span class="word-count">{{ wordCount }} 字</span>
    <span class="separator">·</span>
    <span class="reading-time">约 {{ readingTime }} 分钟</span>
  </div>
</template>

<style scoped>
.reading-info {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--vp-c-text-2);
  font-size: 14px;
  margin-top: 0.5rem;
}
.separator {
  color: var(--vp-c-text-3);
}
</style>
