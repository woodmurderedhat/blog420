import { FullSlug, joinSegments } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"
import { getDate } from "../../components/Date"
import { GlobalConfiguration } from "../../cfg"

interface Options {
  basePath?: string
  pageSize?: number
  rssEnabled?: boolean
}

const defaults: Options = {
  basePath: "/archives/",
  pageSize: 10,
  rssEnabled: false,
}

function monthKey(date: Date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  return `${yyyy}/${mm}`
}

export const ArchivePage: QuartzEmitterPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaults, ...userOpts }
  return {
    name: "ArchivePage",
    async *emit(ctx, content) {
      const cfg: GlobalConfiguration = ctx.cfg.configuration

      // collect archived posts
      const archived: { slug: FullSlug; title: string; date?: Date }[] = []
      for (const [_, file] of content) {
        if ((file.data as any).archived === true) {
          archived.push({
            slug: file.data.slug!,
            title: file.data.frontmatter?.title ?? "(untitled)",
            date: getDate(cfg, file.data),
          })
        }
      }

      // group by year/month
      const months = new Map<string, typeof archived>()
      for (const item of archived) {
        const d = item.date ?? new Date()
        const key = monthKey(d)
        if (!months.has(key)) months.set(key, [])
        months.get(key)!.push(item)
      }

      // emit month index listing
      let monthsList = "<ul>"
      for (const [key, arr] of Array.from(months.entries()).sort().reverse()) {
        monthsList += `<li><a href="${joinSegments(opts.basePath!, key)}">${key} (${arr.length})</a></li>`
      }
      monthsList += "</ul>"

      yield write({
        ctx,
        content: `<html><body><h1>Archives</h1>${monthsList}</body></html>`,
        slug: "archives/index" as FullSlug,
        ext: ".html",
      })

      // emit month pages with pagination
      // emit month pages with pagination
      for (const [key, arr] of months) {
        const sorted = arr.sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0))
        const pageSize = opts.pageSize ?? 10
        const pages = Math.ceil(sorted.length / pageSize)
        for (let p = 0; p < pages; p++) {
          const slice = sorted.slice(p * pageSize, (p + 1) * pageSize)
          let list = "<ul>"
          for (const it of slice) list += `<li><a href="/${it.slug}">${it.title}</a></li>`
          list += "</ul>"
          const pagePath =
            p === 0
              ? `${joinSegments(opts.basePath!, key)}`
              : `${joinSegments(opts.basePath!, key, "page", String(p + 1))}`
          const slug = pagePath.replace(/^\/+/, "") as FullSlug
          const html = `<html><body><h1>Archive: ${key} — page ${p + 1}</h1>${list}</body></html>`
          yield write({ ctx, content: html, slug, ext: ".html" })
        }
      }
    },
  }
}
