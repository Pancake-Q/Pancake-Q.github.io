---
title: 标签
description: 按标签浏览文章
---

<script setup>
import { data as posts } from '../.vitepress/theme/posts.data.js'
import { computed } from 'vue'

function formatDate(dateStr) {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const tags = computed(() => {
  const tagMap = new Map()
  posts.forEach(post => {
    if (post.frontmatter?.tags) {
      post.frontmatter.tags.forEach(tag => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, [])
        }
        tagMap.get(tag).push(post)
      })
    }
  })
  return Array.from(tagMap.entries()).sort((a, b) => b[1].length - a[1].length)
})
</script>

# 标签

<div class="tags-container">
  <div v-for="[tag, tagPosts] in tags" :key="tag" class="tag-section">
    <h2 :id="tag">{{ tag }} <span class="count">({{ tagPosts.length }})</span></h2>
    <ul>
      <li v-for="post in tagPosts" :key="post.url">
        <a :href="post.url">{{ post.frontmatter.title || post.url }}</a>
        <span class="date">{{ formatDate(post.frontmatter.date) }}</span>
      </li>
    </ul>
  </div>
  <p v-if="tags.length === 0" class="no-tags">暂无标签，请在文章 frontmatter 中添加 tags 字段。</p>
</div>

<style scoped>
.tags-container {
  margin-top: 1rem;
}
.tag-section {
  margin-bottom: 2rem;
}
.tag-section h2 {
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 0.5rem;
}
.count {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
}
.tag-section ul {
  list-style: none;
  padding: 0;
}
.tag-section li {
  padding: 0.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.date {
  color: var(--vp-c-text-2);
  font-size: 0.9em;
}
.no-tags {
  color: var(--vp-c-text-2);
}
</style>
