// @ts-nocheck
import { VFile } from "vfile"
import { ContentIndex } from "./contentIndex"

function makeFile(slug, archived = false) {
  const file = new VFile("")
  file.data = {
    slug,
    frontmatter: { title: slug },
    text: "",
    links: [],
    description: "",
    dates: { created: new Date(), modified: new Date(), published: new Date() },
    // archived flag set on file.data
    archived,
  }
  return file
}

test("sitemap excludes archived entries when configured", async () => {
  const plugin = ContentIndex({ enableSiteMap: true, enableRSS: false })

  const ctx = {
    cfg: { configuration: { baseUrl: "example.com", archives: { excludeFromSitemap: true } } },
  }

  const content = [
    [{}, makeFile("posts/old-post", true)],
    [{}, makeFile("posts/new-post", false)],
  ]

  const gen = plugin.emit(ctx, content)
  const first = await gen.next()

  // find sitemap write
  let sitemap = null
  if (first && !first.done) {
    const value = first.value
    if (value && value.slug === "sitemap") {
      sitemap = value.content
    }
  }

  expect(sitemap).toBeTruthy()
  expect(sitemap.includes("posts/old-post")).toBe(false)
  expect(sitemap.includes("posts/new-post")).toBe(true)
})
