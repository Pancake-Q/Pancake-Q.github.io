import { createContentLoader } from 'vitepress'

export default createContentLoader(['blog/**/*.md', 'categories/**/*.md'], {
  includeSrc: false,
  transform(rawData) {
    return rawData
      .filter(page => page.frontmatter?.title && page.url !== '/blog/' && !page.url.endsWith('/index'))
      .sort((a, b) => {
        const dateA = a.frontmatter?.date ? new Date(a.frontmatter.date) : new Date(0)
        const dateB = b.frontmatter?.date ? new Date(b.frontmatter.date) : new Date(0)
        return dateB.getTime() - dateA.getTime()
      })
  }
})
