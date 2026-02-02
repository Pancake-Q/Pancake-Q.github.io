---
title: 归档
description: 按时间浏览文章
---

<script setup>
import { data as posts } from '../.vitepress/theme/posts.data.js'
import { computed } from 'vue'

function formatDate(dateStr) {
  const date = new Date(dateStr)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${month}-${day} ${hours}:${minutes}`
}

const archives = computed(() => {
  const yearMap = new Map()
  posts
    .filter(post => post.frontmatter?.date)
    .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
    .forEach(post => {
      const year = new Date(post.frontmatter.date).getFullYear()
      if (!yearMap.has(year)) {
        yearMap.set(year, [])
      }
      yearMap.get(year).push(post)
    })
  return Array.from(yearMap.entries()).sort((a, b) => b[0] - a[0])
})

const totalPosts = computed(() => posts.length)
</script>

# 归档

<p class="summary">共 {{ totalPosts }} 篇文章</p>

<div class="archives-container">
  <div v-for="[year, yearPosts] in archives" :key="year" class="year-section">
    <h2>{{ year }} <span class="count">({{ yearPosts.length }})</span></h2>
    <ul>
      <li v-for="post in yearPosts" :key="post.url">
        <span class="date">{{ formatDate(post.frontmatter.date) }}</span>
        <a :href="post.url">{{ post.frontmatter.title || post.url }}</a>
      </li>
    </ul>
  </div>
  <p v-if="archives.length === 0" class="no-posts">暂无文章，请在文章 frontmatter 中添加 date 字段。</p>
</div>

<style scoped>
.summary {
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}
.archives-container {
  margin-top: 1rem;
}
.year-section {
  margin-bottom: 2rem;
}
.year-section h2 {
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 0.5rem;
}
.count {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
}
.year-section ul {
  list-style: none;
  padding: 0;
}
.year-section li {
  padding: 0.5rem 0;
  display: flex;
  gap: 1rem;
  align-items: center;
}
.date {
  color: var(--vp-c-text-2);
  font-size: 0.9em;
  min-width: 100px;
}
.no-posts {
  color: var(--vp-c-text-2);
}
</style>
